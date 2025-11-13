import { NextResponse } from "next/server";
import { getRevenueTimeseries } from "@/lib/kpis.server";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? "";
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;

  if (!brandId) {
    return NextResponse.json({ ok: true, data: [] });
  }

  try {
    const data = await getRevenueTimeseries({
      brandId,
      from,
      to,
      campaignId,
    });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[api] revenue-timeseries error", error);
    return NextResponse.json({ ok: false, error: "Failed to load timeseries" }, { status: 500 });
  }
}


