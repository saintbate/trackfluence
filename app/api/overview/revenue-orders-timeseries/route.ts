import { NextResponse } from "next/server";
import { getRevenueOrdersTimeseries } from "@/lib/kpis.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? "";
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;

  if (!brandId) {
    return NextResponse.json({ ok: true, points: [], totals: { revenue: 0, orders: 0 } });
  }

  try {
    const { points, totals } = await getRevenueOrdersTimeseries({
      brandId,
      from,
      to,
      campaignId,
    });
    return NextResponse.json({ ok: true, points, totals });
  } catch (error) {
    console.error("[api] revenue-orders-timeseries error", error);
    return NextResponse.json({ ok: false, error: "Failed to load timeseries" }, { status: 500 });
  }
}


