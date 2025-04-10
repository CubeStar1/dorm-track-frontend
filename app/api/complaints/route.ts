import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student record
    const { data: student } = await supabase
      .from('students')
      .select('user_id, hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (!student) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Fetch complaints with expanded data
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select(`
        *,
        hostel:hostels(
          id,
          name,
          code
        ),
        assigned_staff:users(
          id,
          full_name,
          email
        )
      `)
      .eq('student_id', student.user_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student record
    const { data: student } = await supabase
      .from('students')
      .select('user_id, hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (!student) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();

    // Create complaint
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        hostel_id: student.hostel_id,
        student_id: student.user_id,
        complaint_type: body.complaint_type,
        description: body.description,
        severity: body.severity,
        is_anonymous: body.is_anonymous,
      })
      .select(`
        *,
        hostel:hostels(
          id,
          name,
          code
        ),
        assigned_staff:users(
          id,
          full_name,
          email
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 