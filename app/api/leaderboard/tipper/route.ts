import supabase from '@/lib/supabase';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Panggil fungsi get_tipper_leaderboard dari Supabase
    const { data, error } = await supabase.rpc('get_tipper_leaderboard');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
