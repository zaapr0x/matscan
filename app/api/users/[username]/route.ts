import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "Invalid Username" }, { status: 400 });
  }

  try {
    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("username, balance,created_at") // include balance here
      .eq("username", username)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count transactions where user is sender or receiver
    const { count, error: txError } = await supabase
      .from("transactions")
      .select("txid", { count: "exact", head: true })
      .or(`sender.eq.${username},receiver.eq.${username}`);

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        username,
        balance: userData.balance,
        created_at: userData.created_at,
        transaction_count: count ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
