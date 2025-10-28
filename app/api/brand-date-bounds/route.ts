import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Defensive env checks
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: Request) {
  // Check env vars at runtime
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error: missing required environment variables" },
      { status: 500 }
    );
  }
  const url = new URL(req.url);
  const brandId = url.searchParams.get("brandId");
  
  if (!brandId) {
    return NextResponse.json({ error: "brandId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shop_order")
    .select("order_date")
    .eq("brand_id", brandId)
    .order("order_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Extract min and max dates
  let min: string | null = null;
  let max: string | null = null;

  if (data && data.length > 0) {
    // Convert to YYYY-MM-DD format
    const dates = data.map(row => {
      const date = new Date(row.order_date);
      return date.toISOString().split('T')[0];
    });
    
    min = dates[0]; // First date (sorted ascending)
    max = dates[dates.length - 1]; // Last date
  }

  return NextResponse.json({ min, max });
}


