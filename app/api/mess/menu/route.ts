import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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
      .select('hostel_id, institution_id')
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get the mess menu for the student's hostel and institution
    const { data: menuData, error: menuError } = await supabase
      .from('mess_menu')
      .select(`
        *,
        hostels!inner (
          institution_id
        )
      `)
      .eq('hostel_id', studentData.hostel_id)
      .eq('hostels.institution_id', studentData.institution_id)
      .order('day_of_week')
      .order('meal_type');

    if (menuError) {
      console.error('Error fetching menu:', menuError);
      return NextResponse.json(
        { error: 'Failed to fetch menu' },
        { status: 500 }
      );
    }

    // Transform the data to remove the nested hostels object
    const transformedMenuData = menuData.map(item => ({
      ...item,
      hostel_id: item.hostel_id,
      institution_id: item.hostels.institution_id
    }));

    return NextResponse.json(transformedMenuData);
  } catch (error) {
    console.error('Error in menu fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 