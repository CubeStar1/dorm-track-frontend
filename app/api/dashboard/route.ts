import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { DashboardData } from '@/lib/api/services/dashboard';
import { Room, Roommate } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  role: string;
  institution_id: string;
}

interface StudentRecord {
  user_id: string;
  student_id: string;
  department: string | null;
  year_of_study: number | null;
  room_id: string | null;
  users: UserRecord;
}

interface RoommateRecord {
  user_id: string;
  student_id: string;
  department: string | null;
  year_of_study: number | null;
  users: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  };
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Get the user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get user details with student info
    const { data: userData, error: userError } = await supabase
      .from('students')
      .select(`
        user_id,
        student_id,
        department,
        year_of_study,
        room_id,
        users (
          id,
          full_name,
          email,
          phone,
          gender,
          role,
          institution_id
        )
      `)
      .eq('user_id', session.user.id)
      .single() as { data: StudentRecord | null; error: any };

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Failed to fetch user details', userError },
        { status: 500 }
      );
    }

    // Transform user data
    const user = {
      id: userData.user_id,
      full_name: userData.users.full_name,
      email: userData.users.email,
      student_id: userData.student_id,
      department: userData.department ?? undefined,
      year_of_study: userData.year_of_study ?? undefined
    };

    // Get room data if assigned
    let room: Room | null = null;
    if (userData.room_id) {
      // Get room details with hostel information
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select(`
          *,
          hostel:hostels (
            id,
            name,
            code,
            address,
            city,
            state,
            contact_email,
            contact_phone,
            total_blocks,
            total_rooms
          )
        `)
        .eq('id', userData.room_id)
        .single();

      if (roomError || !roomData) {
        console.error('Error fetching room:', roomError);
      } else {
        // Get roommates
        const { data: roommatesData, error: roommatesError } = await supabase
          .from('students')
          .select(`
            user_id,
            student_id,
            department,
            year_of_study,
            users (
              id,
              full_name,
              email,
              phone
            )
          `)
          .eq('room_id', userData.room_id) as { data: RoommateRecord[] | null; error: any };

        if (!roommatesError && roommatesData) {
          // Transform roommates data
          const roommates: Roommate[] = roommatesData.map(roommate => ({
            id: roommate.user_id,
            full_name: roommate.users.full_name,
            email: roommate.users.email,
            phone: roommate.users.phone ?? undefined,
            student_id: roommate.student_id,
            department: roommate.department ?? undefined,
            year_of_study: roommate.year_of_study ?? undefined,
            is_you: roommate.user_id === session.user.id
          }));

          // Transform room data
          room = {
            id: roomData.id,
            hostel_id: roomData.hostel_id,
            hostel: roomData.hostel,
            room_number: roomData.room_number,
            block: roomData.block,
            floor: roomData.floor,
            capacity: roomData.capacity,
            current_occupancy: roomData.current_occupancy,
            room_type: roomData.room_type,
            amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
            status: roomData.status,
            price: roomData.price,
            description: roomData.description || 'Spacious and well-ventilated room with modern amenities.',
            images: Array.isArray(roomData.images) && roomData.images.length > 0 
              ? roomData.images 
              : [DEFAULT_ROOM_IMAGE],
            roommates
          };
        }
      }
    }

    const dashboardData: DashboardData = {
      user,
      room
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 