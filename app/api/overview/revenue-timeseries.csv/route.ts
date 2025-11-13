import { NextResponse } from "next/server";
import { getRevenueTimeseries } from "@/lib/kpis.server";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? "";
  const from = searchParams.get("dateFrom") ?? undefined;
  const to = searchParams.get("dateTo") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;
  if (!brandId) {
    return new NextResponse("date,revenue\n", { headers: { "content-type": "text/csv; charset=utf-8" } });
  }
  const points = await getRevenueTimeseries({ brandId, from, to, campaignId });
  const header = "date,revenue\n";
  const rows = points.map((p) => `${p.date},${p.revenue}`).join("\n");
  return new NextResponse(header + rows + "\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="overview_timeseries.csv"`,
    },
  });
}


