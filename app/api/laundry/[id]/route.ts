import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
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

    // Get laundry slot with expanded student and hostel info
    const { data: slot, error: slotError } = await supabase
      .from('laundry_slots')
      .select(`
        *,
        student:students(
          user_id,
          student_id,
          user:users(
            full_name,
            email
          )
        ),
        hostel:hostels(
          name,
          code
        )
      `)
      .eq('id', id)
      .eq('hostel_id', student.hostel_id)
      .single();

    if (slotError) {
      return NextResponse.json(
        { error: 'Failed to fetch laundry slot' },
        { status: 500 }
      );
    }

    if (!slot) {
      return NextResponse.json(
        { error: 'Laundry slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slot);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;

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

    // Get the current slot state
    const { data: currentSlot, error: slotError } = await supabase
      .from('laundry_slots')
      .select('*')
      .eq('id', id)
      .eq('hostel_id', student.hostel_id)
      .single();

    if (slotError || !currentSlot) {
      return NextResponse.json(
        { error: 'Laundry slot not found' },
        { status: 404 }
      );
    }

    // Only allow students to update their own bookings
    if (currentSlot.student_id && currentSlot.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this slot' },
        { status: 403 }
      );
    }

    // Update the slot
    const { data: updatedSlot, error: updateError } = await supabase
      .from('laundry_slots')
      .update({
        status: 'available',
        student_id: null
      })
      .eq('id', id)
      .select(`
        *,
        student:students(user_id, student_id)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update laundry slot' },
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