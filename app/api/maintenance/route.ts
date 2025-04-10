import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the user's student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('user_id, hostel_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get maintenance requests for the student with expanded data
    const { data: requests, error: requestsError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        hostel:hostels(id, name),
        room:rooms(id, room_number),
        assigned_to:users(id, full_name, email)
      `)
      .eq('student_id', studentData.user_id)
      .order('created_at', { ascending: false });

    if (requestsError) {
      return NextResponse.json(
        { error: 'Failed to fetch maintenance requests' },
        { status: 500 }
      );
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface MaintenanceRequestBody {
  issueType: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the user's student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('user_id, hostel_id, room_id')
      .eq('user_id', session.user.id)
      .single();

    if (studentError) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    const requestBody: MaintenanceRequestBody = await request.json();
    const { issueType, description, priority } = requestBody;

    // Create the maintenance request
    const { data: maintenanceRequest, error: requestError } = await supabase
      .from('maintenance_requests')
      .insert({
        hostel_id: studentData.hostel_id,
        student_id: studentData.user_id,
        room_id: studentData.room_id,
        issue_type: issueType,
        description,
        priority,
        status: 'pending'
      })
      .select(`
        *,
        hostel:hostels(id, name),
        room:rooms(id, room_number),
        assigned_to:users(id, full_name, email)
      `)
      .single();

    if (requestError) {
      return NextResponse.json(
        { error: 'Failed to create maintenance request ' + requestError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(maintenanceRequest);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 