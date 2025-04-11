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
      .select('institution_id')
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get items from the same institution
    const { data: items, error: itemsError } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        seller:students!inner (
          user_id,
          student_id,
          users!inner (
            full_name
          )
        )
      `)
      .eq('seller.institution_id', studentData.institution_id)
      .order('created_at', { ascending: false });

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch items' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedItems = items.map(item => ({
      ...item,
      seller: {
        full_name: item.seller.users.full_name,
        student_id: item.seller.student_id
      }
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('Error in items fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      return NextResponse.json(
        { error: 'Student record not found' },
        { status: 404 }
      );
    }

    // Get the request body
    const item = await request.json();

    // Create the item
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert([
        {
          ...item,
          seller_id: studentData.user_id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in item creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 