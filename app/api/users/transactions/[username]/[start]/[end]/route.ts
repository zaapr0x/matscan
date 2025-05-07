import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: {params: Promise<{ username: string; start: string; end: string }> }
) {
  const { username, start, end } = await params;

  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "new";

  const startInt = parseInt(start, 10);
  const endInt = parseInt(end, 10);
  const limit = Math.min(100, endInt - startInt + 1);

  if (!username || isNaN(startInt) || isNaN(endInt) || limit <= 0) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const order = sort === "old" ? "asc" : "desc";

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender.eq.${username},receiver.eq.${username}`)
      .order("timestamp", { ascending: order === "asc" })
      .range(startInt - 1, startInt - 1 + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
