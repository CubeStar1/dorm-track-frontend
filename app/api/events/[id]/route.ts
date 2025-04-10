import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface EventRegistration {
  status: 'registered' | 'attended' | 'cancelled';
}

export async function GET(
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

    // Get user's institution_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get student record if exists
    const { data: student } = await supabase
      .from('students')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();

    // Get event with organizer info
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(
          id,
          full_name,
          email
        )
      `)
      .eq('id', params.id)
      .eq('institution_id', user.institution_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get registration count
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event.id)
      .eq('status', 'registered');

    event.registrations_count = count || 0;

    // If user is a student, check their registration status
    if (student) {
      const { data: registration } = await supabase
        .from('event_registrations')
        .select('status')
        .eq('event_id', event.id)
        .eq('student_id', session.user.id)
        .eq('status', 'registered')
        .single();

      event.is_registered = !!registration;
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    // Get user's role and institution_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('institution_id, role')
      .eq('id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only staff members can update events
    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Only staff members can update events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      event_date,
      location,
      max_participants,
      registration_deadline,
      image_url,
      category,
      status
    } = body;

    // Update event
    const { data: event, error: updateError } = await supabase
      .from('events')
      .update({
        title,
        description,
        event_date,
        location,
        max_participants,
        registration_deadline,
        image_url,
        category,
        status
      })
      .eq('id', params.id)
      .eq('institution_id', user.institution_id)
      .select(`
        *,
        organizer:users!organizer_id(
          id,
          full_name,
          email
        )
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 