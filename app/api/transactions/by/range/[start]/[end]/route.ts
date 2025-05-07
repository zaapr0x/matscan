import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ start: string; end: string }> }
) {
  // Await params to access start and end
  const { start, end } = await params;

  // Extract sort query parameter
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "new";

  // Parse start and end as integers
  const startInt = parseInt(start, 10);
  const endInt = parseInt(end, 10);
  const limit = Math.min(100, endInt - startInt + 1);

  // Validate parameters
  if (isNaN(startInt) || isNaN(endInt) || limit <= 0) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  // Determine sort order
  const order = sort === "old" ? "asc" : "desc";

  try {
    // Fetch transactions from Supabase
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
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