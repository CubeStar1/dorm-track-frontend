import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // First get the student's room assignment
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('room_id')
      .eq('user_id', userId)
      .single();

    if (studentError) {
      return NextResponse.json(
        { error: 'Failed to fetch student record' },
        { status: 500 }
      );
    }

    if (!student?.room_id) {
      return NextResponse.json(
        { error: 'No room assigned to this user' },
        { status: 404 }
      );
    }

    // Fetch the room details
    const { data: room, error: roomError } = await supabase
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
        ),
        roommates:students!room_id (
          user_id,
          student_id,
          user:users (
            id,
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('id', student.room_id)
      .single();

    if (roomError) {
      return NextResponse.json(
        { error: 'Failed to fetch room details' },
        { status: 500 }
      );
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the Room interface
    const transformedData: Room = {
      id: room.id,
      hostel_id: room.hostel_id,
      hostel: room.hostel,
      room_number: room.room_number,
      block: room.block,
      floor: room.floor,
      capacity: room.capacity,
      current_occupancy: room.current_occupancy,
      room_type: room.room_type,
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      status: room.status as Room['status'],
      price: room.price,
      description: room.description || 'No description available',
      images: Array.isArray(room.images) && room.images.length > 0 
        ? room.images 
        : [DEFAULT_ROOM_IMAGE],
      roommates: room.roommates || []
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching user room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 