import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room } from '@/lib/api/services/rooms';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomNumber = searchParams.get('roomNumber');
    const userId = searchParams.get('userId');

    console.log('Request params:', { roomNumber, userId });

    if (!roomNumber && !userId) {
      return NextResponse.json(
        { error: 'Either roomNumber or userId must be provided' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // If roomNumber is provided, fetch that specific room
    if (roomNumber) {
      console.log('Fetching room by number:', roomNumber);
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
        .eq('room_number', roomNumber)
        .single();

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching room by number:', error);
        return NextResponse.json(
          { error: 'Failed to fetch room' },
          { status: 500 }
        );
      }

      if (!data) {
        console.log('No room found for number:', roomNumber);
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

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
          : [DEFAULT_ROOM_IMAGE],
        roommates: data.roommates || []
      };

      return NextResponse.json(transformedData);
    }

    // If userId is provided, fetch the user's current room
    if (userId) {
      console.log('Fetching student record for user:', userId);
      
      // First get the student's record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('user_id, room_id')
        .eq('user_id', userId)
        .single();

      if (studentError) {
        console.error('Error fetching student:', studentError);
        return NextResponse.json(
          { error: 'Failed to fetch student record', details: studentError.message },
          { status: 500 }
        );
      }

      if (!student) {
        console.log('No student found for user:', userId);
        return NextResponse.json(
          { error: 'Student record not found' },
          { status: 404 }
        );
      }

      console.log('Found student:', student);

      // If student has a direct room_id, use that
      if (student.room_id) {
        console.log('Student has direct room assignment:', student.room_id);
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
          console.error('Error fetching room by direct assignment:', roomError);
          return NextResponse.json(
            { error: 'Failed to fetch room details' },
            { status: 500 }
          );
        }

        if (!room) {
          console.log('No room found for direct assignment:', student.room_id);
          return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
          );
        }

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
          description: room.description || 'Spacious and well-ventilated room with modern amenities.',
          images: Array.isArray(room.images) && room.images.length > 0 
            ? room.images 
            : [DEFAULT_ROOM_IMAGE],
          roommates: room.roommates || []
        };

        return NextResponse.json(transformedData);
      }

      // Otherwise check room allocations
      console.log('Checking room allocations for student:', student.user_id);
      const { data: allocation, error: allocationError } = await supabase
        .from('room_allocations')
        .select('room_id')
        .eq('student_id', student.user_id)
        .eq('status', 'active')
        .single();

      if (allocationError) {
        console.error('Error fetching room allocation:', allocationError);
        return NextResponse.json(
          { error: 'Failed to fetch room allocation', details: allocationError.message },
          { status: 500 }
        );
      }

      if (!allocation) {
        console.log('No active room allocation found for student:', student.user_id);
        return NextResponse.json(
          { error: 'No active room allocation found' },
          { status: 404 }
        );
      }

      console.log('Found room allocation:', allocation);

      // Finally fetch the room details
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
        .eq('id', allocation.room_id)
        .single();

      if (roomError) {
        console.error('Error fetching room details:', roomError);
        return NextResponse.json(
          { error: 'Failed to fetch room details' },
          { status: 500 }
        );
      }

      if (!room) {
        console.log('No room found for allocation:', allocation.room_id);
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

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
        description: room.description || 'Spacious and well-ventilated room with modern amenities.',
        images: Array.isArray(room.images) && room.images.length > 0 
          ? room.images 
          : [DEFAULT_ROOM_IMAGE],
        roommates: room.roommates || []
      };

      return NextResponse.json(transformedData);
    }

  } catch (error) {
    console.error('Error in room details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 