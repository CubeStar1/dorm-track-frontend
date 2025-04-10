import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const floor = searchParams.get('floor');
    const roomType = searchParams.get('roomType');
    const status = searchParams.get('status');
    const amenities = searchParams.get('amenities')?.split(',');
    const hostelId = searchParams.get('hostelId');

    const supabase = await createSupabaseServer();
    let query = supabase
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
      `);

    if (block) query = query.eq('block', block);
    if (floor) query = query.eq('floor', parseInt(floor));
    if (roomType) query = query.eq('room_type', roomType);
    if (status) query = query.eq('status', status);
    if (amenities?.length) query = query.contains('amenities', amenities);
    if (hostelId) query = query.eq('hostel_id', hostelId);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch rooms' },
        { status: 500 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedData: Room[] = data.map(room => ({
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
      description: room.description || 'Spacious and well-ventilated room with modern amenities.',
      images: Array.isArray(room.images) && room.images.length > 0 
        ? room.images 
        : [DEFAULT_ROOM_IMAGE]
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 