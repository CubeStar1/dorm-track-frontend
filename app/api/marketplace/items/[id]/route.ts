import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the item with seller information
    const { data: item, error: itemError } = await supabase
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
      .eq('id', params.id)
      .eq('seller.institution_id', studentData.institution_id)
      .single();

    if (itemError) {
      console.error('Error fetching item:', itemError);
      return NextResponse.json(
        { error: 'Failed to fetch item' },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedItem = {
      ...item,
      seller: {
        full_name: item.seller.users.full_name,
        student_id: item.seller.student_id
      }
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error('Error in item fetch:', error);
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
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the item to check ownership
    const { data: item, error: itemError } = await supabase
      .from('marketplace_items')
      .select('seller_id')
      .eq('id', params.id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if the user is the seller
    if (item.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this item' },
        { status: 403 }
      );
    }

    // Get the request body
    const updates = await request.json();

    // Update the item
    const { data, error } = await supabase
      .from('marketplace_items')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in item update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the item to check ownership
    const { data: item, error: itemError } = await supabase
      .from('marketplace_items')
      .select('seller_id')
      .eq('id', params.id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if the user is the seller
    if (item.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this item' },
        { status: 403 }
      );
    }

    // Delete the item
    const { error } = await supabase
      .from('marketplace_items')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting item:', error);
      return NextResponse.json(
        { error: 'Failed to delete item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error in item deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 