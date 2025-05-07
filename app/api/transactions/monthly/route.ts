// app/api/transactions/monthly/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.rpc("get_monthly_transactions");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
