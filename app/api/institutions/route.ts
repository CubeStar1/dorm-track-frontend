import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServer();

  try {
    const { data, error } = await supabase
      .from('institutions')
      .select('id, name, code')
      .order('name');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 