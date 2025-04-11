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

    // Get transactions for the student's institution
    const { data: transactions, error: transactionsError } = await supabase
      .from('marketplace_transactions')
      .select(`
        *,
        item:marketplace_items!inner (
          *,
          seller:students!inner (
            user_id,
            student_id,
            users!inner (
              full_name
            )
          )
        ),
        buyer:students!inner (
          user_id,
          student_id,
          users!inner (
            full_name
          )
        ),
        seller:students!inner (
          user_id,
          student_id,
          users!inner (
            full_name
          )
        )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedTransactions = transactions.map(transaction => ({
      ...transaction,
      item: {
        ...transaction.item,
        seller: {
          full_name: transaction.item.seller.users.full_name,
          student_id: transaction.item.seller.student_id
        }
      },
      buyer: {
        full_name: transaction.buyer.users.full_name,
        student_id: transaction.buyer.student_id
      },
      seller: {
        full_name: transaction.seller.users.full_name,
        student_id: transaction.seller.student_id
      }
    }));

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Error in transactions fetch:', error);
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

    // Get the request body
    const { item_id, seller_id, amount } = await request.json();

    // Create the transaction
    const { data, error } = await supabase
      .from('marketplace_transactions')
      .insert([
        {
          item_id,
          buyer_id: user.id,
          seller_id,
          amount,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Update the item status to reserved
    const { error: updateError } = await supabase
      .from('marketplace_items')
      .update({ status: 'reserved' })
      .eq('id', item_id);

    if (updateError) {
      console.error('Error updating item status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update item status' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in transaction creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 