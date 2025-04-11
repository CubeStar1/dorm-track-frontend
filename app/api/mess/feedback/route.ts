import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the student record for the current user
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('user_id, hostel_id')
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get the request body
    const { menuId, rating, feedback } = await request.json();

    if (!menuId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit the feedback
    const { data, error } = await supabase
      .from('mess_feedback')
      .insert([
        {
          hostel_id: studentData.hostel_id,
          student_id: studentData.user_id,
          menu_id: menuId,
          rating: rating,
          feedback: feedback || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in feedback submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 