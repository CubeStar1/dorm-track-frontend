import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's institution_id and verify they are a student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('user_id, institution_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Only students can register for events' },
        { status: 403 }
      );
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', params.id)
      .eq('institution_id', student.institution_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if registration is closed
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Registration deadline has passed' },
        { status: 400 }
      );
    }

    // Check if event is full
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', params.id)
      .eq('status', 'registered');

    const registrationCount = count ?? 0;
    if (event.max_participants && registrationCount >= event.max_participants) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    // Check if user already has a registration (active or cancelled)
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id, status')
      .eq('event_id', params.id)
      .eq('student_id', session.user.id)
      .single();

    if (existingRegistration?.status === 'registered') {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    let registration;
    let registrationError;

    if (existingRegistration) {
      // Update existing registration
      const result = await supabase
        .from('event_registrations')
        .update({ status: 'registered', updated_at: new Date().toISOString() })
        .eq('id', existingRegistration.id)
        .select()
        .single();
      
      registration = result.data;
      registrationError = result.error;
    } else {
      // Create new registration
      const result = await supabase
        .from('event_registrations')
        .insert({
          event_id: params.id,
          student_id: session.user.id,
          status: 'registered'
        })
        .select()
        .single();
      
      registration = result.data;
      registrationError = result.error;
    }

    if (registrationError) {
      return NextResponse.json(
        { error: 'Failed to register for event', details: registrationError },
        { status: 500 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update registration status to cancelled
    const { data: registration, error: registrationError } = await supabase
      .from('event_registrations')
      .update({ status: 'cancelled' })
      .eq('event_id', params.id)
      .eq('student_id', session.user.id)
      .select()
      .single();

    if (registrationError) {
      return NextResponse.json(
        { error: 'Failed to cancel registration' },
        { status: 500 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 