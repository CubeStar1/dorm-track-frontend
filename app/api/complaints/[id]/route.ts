import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('user_id, hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student record not found' + studentError?.message }, { status: 404 });
    }

    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .select(`
        *,
        hostel:hostels(id, name),
        assigned_staff:users(id, full_name, email)
      `)
      .eq('id', id)
      .eq('hostel_id', student.hostel_id)
      .single();

    if (complaintError || !complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error in GET /api/complaints/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, resolution_notes, assigned_to } = body;

    // Check if user is staff member
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Only staff members can update complaints' }, { status: 403 });
    }

    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .update({
        status,
        resolution_notes,
        assigned_to,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        hostel:hostels(id, name),
        assigned_staff:users(id, full_name, email)
      `)
      .single();

    if (complaintError || !complaint) {
      return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error in PATCH /api/complaints/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 