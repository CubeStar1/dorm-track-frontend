import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    const { fullName, phone, gender, studentId, department, yearOfStudy, institutionId } = await request.json();

    // Start a transaction by using the Supabase client
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: session.user.id,
        full_name: fullName,
        email: session.user.email,
        phone,
        gender,
        role: 'student',
        institution_id: institutionId
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create the student record
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: session.user.id,
        student_id: studentId,
        department,
        year_of_study: yearOfStudy,
        institution_id: institutionId
      });

    if (studentError) {
      console.error('Student creation error:', studentError);
      // If student creation fails, we should ideally roll back the user creation
      // but Supabase doesn't support transactions directly, so we'll need to handle this manually
      await supabase.from('users').delete().eq('id', session.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create student profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 