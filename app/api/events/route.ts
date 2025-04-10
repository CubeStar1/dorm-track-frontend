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

    // Get student record if exists (to check registration status)
    const { data: student } = await supabase
      .from('students')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();

    // Get events with registration counts and organizer info
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(
          id,
          full_name,
          email
        ),
        registrations:event_registrations(
          id,
          status,
          student:students(
            user_id,
            student_id,
            user:users(
              id,
              full_name,
              email
            ),
            hostel:hostels(
              id,
              name,
              code
            )
          )
        )
      `)
      .eq('institution_id', user.institution_id)
      .order('event_date', { ascending: true });

    if (eventsError) {
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    // If user is a student, check their registration status for each event
    if (student) {
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select('event_id, status')
        .eq('student_id', session.user.id);

      const registrationMap = new Map(
        registrations?.map(reg => [reg.event_id, reg.status]) || []
      );

      events.forEach(event => {
        event.registrations_count = event.registrations?.filter((r: { status: string }) => r.status === 'registered').length || 0;
        event.is_registered = registrationMap.get(event.id) === 'registered';
        // Keep the registrations array for the frontend
      });
    } else {
      events.forEach(event => {
        event.registrations_count = event.registrations?.filter((r: { status: string }) => r.status === 'registered').length || 0;
        // Keep the registrations array for the frontend
      });
    }

    return NextResponse.json(events);
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's institution_id and role
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

    // Only staff members can create events
    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Only staff members can create events' },
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
      category
    } = body;

    // Validate required fields
    if (!title || !description || !event_date || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create event
    const { data: event, error: createError } = await supabase
      .from('events')
      .insert({
        institution_id: user.institution_id,
        organizer_id: session.user.id,
        title,
        description,
        event_date,
        location,
        max_participants,
        registration_deadline,
        image_url,
        category
      })
      .select(`
        *,
        organizer:users!organizer_id(
          id,
          full_name,
          email
        )
      `)
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create event' },
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