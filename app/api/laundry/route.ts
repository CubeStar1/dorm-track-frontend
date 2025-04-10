import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get all laundry slots for the student's hostel
    const { data: slots, error: slotsError } = await supabase
      .from('laundry_slots')
      .select(`
        *,
        student:students(user_id, student_id)
      `)
      .eq('hostel_id', student.hostel_id)
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (slotsError) {
      return NextResponse.json(
        { error: 'Failed to fetch laundry slots' },
        { status: 500 }
      );
    }

    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

    const { machine_number, date, time_slot } = body;

    if (!machine_number || !date || !time_slot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Check if student already has a booking for this date
    const { data: existingBooking, error: bookingCheckError } = await supabase
      .from('laundry_slots')
      .select('id')
      .eq('date', date)
      .eq('student_id', session.user.id)
      .eq('status', 'booked')
      .single();

    if (bookingCheckError && bookingCheckError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to check existing bookings' },
        { status: 500 }
      );
    }

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You already have a booking for this date' },
        { status: 400 }
      );
    }

    // First, check if the slot is available
    const { data: existingSlot, error: slotCheckError } = await supabase
      .from('laundry_slots')
      .select('id, status')
      .eq('hostel_id', student.hostel_id)
      .eq('machine_number', machine_number)
      .eq('date', date)
      .eq('time_slot', time_slot)
      .single();

    if (slotCheckError) {
      return NextResponse.json(
        { error: 'Failed to check slot availability' },
        { status: 500 }
      );
    }

    if (!existingSlot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    if (existingSlot.status !== 'available') {
      return NextResponse.json(
        { error: 'Slot is not available' },
        { status: 400 }
      );
    }

    // Update the slot to booked status
    const { data: updatedSlot, error: updateError } = await supabase
      .from('laundry_slots')
      .update({
        student_id: session.user.id,
        status: 'booked',
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSlot.id)
      .select(`
        *,
        student:students(user_id, student_id)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to book slot', details: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedSlot);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 