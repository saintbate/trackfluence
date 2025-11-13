import { NextResponse } from "next/server";
import { getInfluencerTimeseries } from "@/lib/influencers";

export const revalidate = 60;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? "";
  const from = searchParams.get("dateFrom") ?? undefined;
  const to = searchParams.get("dateTo") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;
  if (!params.id || !brandId) return NextResponse.json({ ok: true, data: [] });
  try {
    const data = await getInfluencerTimeseries({
      influencerId: params.id,
      brandId,
      from,
      to,
      campaignId,
    });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[api] influencer timeseries error", e);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}


