import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txid: string;}> }
) {
 
  const { txid } = await params;

  if (txid === "") {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  try {
    // Fetch transactions from Supabase
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("txid", txid)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}