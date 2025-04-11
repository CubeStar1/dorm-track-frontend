import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    // Get the item ID from query parameters
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Get messages for the item
    const { data: messages, error: messagesError } = await supabase
      .from('marketplace_messages')
      .select(`
        *,
        sender:students!marketplace_messages_sender_id_fkey (
          user_id,
          student_id,
          users!inner (
            full_name
          )
        ),
        receiver:students!marketplace_messages_receiver_id_fkey (
          user_id,
          student_id,
          users!inner (
            full_name
          )
        )
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedMessages = messages.map(message => ({
      ...message,
      sender: {
        full_name: message.sender.users.full_name,
        student_id: message.sender.student_id
      },
      receiver: {
        full_name: message.receiver.users.full_name,
        student_id: message.receiver.student_id
      }
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error('Error in messages fetch:', error);
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
    const { item_id, receiver_id, message } = await request.json();

    // Create the message
    const { data, error } = await supabase
      .from('marketplace_messages')
      .insert([
        {
          item_id,
          sender_id: user.id,
          receiver_id,
          message
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in message creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 