import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
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

    // Get user's institution ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // First get the hostels for this institution
    const { data: hostels, error: hostelsError } = await supabase
      .from('hostels')
      .select('id')
      .eq('institution_id', userData.institution_id);

    if (hostelsError) {
      return NextResponse.json(
        { error: 'Failed to fetch hostels' },
        { status: 500 }
      );
    }

    const hostelIds = hostels.map(h => h.id);

    const { data, error } = await supabase
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
          total_rooms,
          institution_id
        )
      `)
      .eq('id', params.roomId)
      .in('hostel_id', hostelIds)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch room' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedData: Room = {
      id: data.id,
      hostel_id: data.hostel_id,
      hostel: data.hostel,
      room_number: data.room_number,
      block: data.block,
      floor: data.floor,
      capacity: data.capacity,
      current_occupancy: data.current_occupancy,
      room_type: data.room_type,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      status: data.status as Room['status'],
      price: data.price,
      description: data.description || 'Spacious and well-ventilated room with modern amenities.',
      images: Array.isArray(data.images) && data.images.length > 0 
        ? data.images 
        : [DEFAULT_ROOM_IMAGE]
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 