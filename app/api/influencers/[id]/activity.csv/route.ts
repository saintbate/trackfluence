import { NextResponse } from "next/server";
import { getInfluencerActivity } from "@/lib/influencers";

export const revalidate = 60;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? "";
  const from = searchParams.get("dateFrom") ?? undefined;
  const to = searchParams.get("dateTo") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;
  if (!params.id || !brandId) return new NextResponse("date_start,date_end,campaign,url,revenue,orders\n", { headers: { "content-type": "text/csv" } });
  const { rows } = await getInfluencerActivity({ influencerId: params.id, brandId, from, to, campaignId, page: 1, pageSize: 1000 });
  const header = "date_start,date_end,campaign,url,revenue,orders\n";
  const body = rows
    .map((r: any) => {
      const cs = r.campaign?.name ?? r.campaign_id ?? "";
      const esc = (s: string) => `"${String(s ?? "").replaceAll(`"`, `""`)}"`;
      return [r.period_start ?? "", r.period_end ?? "", cs, r.url ?? "", r.revenue ?? 0, r.num_orders ?? 0].map(esc).join(",");
    })
    .join("\n");
  return new NextResponse(header + body + "\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="influencer_activity.csv"`,
    },
  });
}


