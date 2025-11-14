import { createServerClient } from "@/lib/supabase/server";
import { getCampaignKpis, getCampaignRevenueTimeseries, getTopInfluencersForCampaign } from "@/lib/analytics/campaign";
import CampaignKpiGrid from "@/components/campaign/KpiGrid";
import RevenueChart from "@/components/campaign/RevenueChart";
import TopInfluencersForCampaign from "@/components/campaign/TopInfluencersTable";
import Empty from "@/components/states/Empty";

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { campaignId } = await params;
  const resolvedSearch = await searchParams;
  const dateFrom = typeof resolvedSearch?.dateFrom === "string" ? resolvedSearch?.dateFrom : null;
  const dateTo = typeof resolvedSearch?.dateTo === "string" ? resolvedSearch?.dateTo : null;

  const supabase = createServerClient();
  const { data: campaignRow } = await supabase.from("campaign").select("id,name").eq("id", campaignId).maybeSingle();
  const campaignName = campaignRow?.name ?? "Campaign";

  const [kpis, timeseries, topInfluencers] = await Promise.all([
    getCampaignKpis(campaignId, dateFrom, dateTo),
    getCampaignRevenueTimeseries(campaignId, dateFrom, dateTo),
    getTopInfluencersForCampaign(campaignId, dateFrom, dateTo),
  ]);

  const hasAnyData = (kpis.totalRevenue ?? 0) > 0 || (kpis.orders ?? 0) > 0 || timeseries.length > 0 || topInfluencers.length > 0;

  return (
    <div className="space-y-8">
      <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {campaignName}
      </h1>

      {!hasAnyData ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-10 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <Empty variant="no-influencers" />
        </div>
      ) : (
        <>
          <section aria-label="KPIs">
            <CampaignKpiGrid kpis={kpis} />
          </section>
          <section aria-label="Revenue over time" className="transition-opacity duration-300 data-[loading=true]:opacity-40">
            <RevenueChart timeseries={timeseries} />
          </section>
          <section aria-label="Top influencers" className="space-y-3 transition-opacity duration-300 data-[loading=true]:opacity-40">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Influencers</h2>
            <TopInfluencersForCampaign rows={topInfluencers} />
          </section>
        </>
      )}
    </div>
  );
}


