import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

export async function GET(
  request: Request,
  { params }: { params: { roomNumber: string } }
) {
  try {
    const supabase = await createSupabaseServer();
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
          total_rooms
        )
      `)
      .eq('room_number', params.roomNumber)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch room' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Room not found' },
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