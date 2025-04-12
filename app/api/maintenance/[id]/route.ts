import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const supabase = await createSupabaseServer();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the maintenance request with expanded data
    const { data: maintenanceRequest, error: requestError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        hostel:hostels(id, name),
        room:rooms(id, room_number),
        assigned_to:users(id, full_name, email)
      `)
      .eq('id', id)
      .single();

    if (requestError) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Verify that the user has access to this request
    if (maintenanceRequest.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to view this request' },
        { status: 403 }
      );
    }

    return NextResponse.json(maintenanceRequest);
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
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
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    // Get the maintenance request to verify ownership
    const { data: existingRequest, error: requestError } = await supabase
      .from('maintenance_requests')
      .select('student_id')
      .eq('id', id)
      .single();

    if (requestError || !existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Verify that the user has access to this request
    if (existingRequest.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this request' },
        { status: 403 }
      );
    }

    // Update the request status
    const { error: updateError } = await supabase
      .from('maintenance_requests')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update maintenance request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 