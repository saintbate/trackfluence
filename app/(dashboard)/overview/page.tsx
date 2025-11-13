// app/(dashboard)/overview/page.tsx
import React from "react";

// server data funcs
import { getOverviewKpis, getTopInfluencers } from "@/lib/kpis.server";

// UI components
import KpiGrid from "@/components/KPI/KpiGrid";
import TopInfluencersTable from "@/components/TopInfluencersTable";
import RevenueArea from "@/components/charts/RevenueArea";
import Empty from "@/components/states/Empty";
import ControlsRow from "./ControlsRow";
import { getRevenueTimeseries } from "@/lib/kpis.server";
import { EMPTY_KPIS, toKPIs } from "@/lib/kpis.shared";
import RefreshDropdown from "@/components/social/RefreshDropdown";
import SocialLineChart, { type SocialSeries } from "@/components/charts/SocialLineChart";
import { createServerClient } from "@/lib/supabase/server";

type WindowParams = {
  campaignId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  page?: string | null;
  limit?: string | null;
};

function readParam(
  search: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const v = search[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const params: WindowParams = {
    campaignId: readParam(searchParams ?? {}, "campaignId"),
    dateFrom: readParam(searchParams ?? {}, "dateFrom"),
    dateTo: readParam(searchParams ?? {}, "dateTo"),
    page: readParam(searchParams ?? {}, "page"),
    limit: readParam(searchParams ?? {}, "limit"),
  };

  // Brand selection (may be null/undefined)
  const brandId = readParam(searchParams ?? {}, "brandId");

  // Map window params to lib function signatures
  const kpiParams = {
    brandId: brandId ?? "",
    from: params.dateFrom ?? undefined,
    to: params.dateTo ?? undefined,
    campaignId: params.campaignId ?? undefined,
    limit: undefined as number | undefined, // kept for consistency
  };

  const pageSize = Math.max(Number.parseInt(params.limit ?? "10", 10) || 10, 1);
  const pageNum = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const topParams = {
    brandId: brandId ?? "",
    from: params.dateFrom ?? undefined,
    to: params.dateTo ?? undefined,
    campaignId: params.campaignId ?? undefined,
    page: pageNum,
    pageSize,
  };

  // Fetch only if a brand is selected; otherwise return empty/zero shapes
  const [kpisRaw, topInfluencers, timeseries] = brandId
    ? await Promise.all([
        getOverviewKpis(kpiParams),
        getTopInfluencers(topParams),
        getRevenueTimeseries({ brandId, from: params.dateFrom ?? undefined, to: params.dateTo ?? undefined, campaignId: params.campaignId ?? undefined }),
      ])
    : [
        {
          totalSpend: 0,
          totalRevenue: 0,
          roas: 0,
          cac: 0,
          activeCampaigns: 0,
        },
        { rows: [], total: 0, page: pageNum, pageSize } as Awaited<ReturnType<typeof getTopInfluencers>>,
        [] as Awaited<ReturnType<typeof getRevenueTimeseries>>,
      ];
  const kpis = toKPIs(kpisRaw ?? EMPTY_KPIS);
  const supabase = createServerClient();
  const [igDailyRes, ttDailyRes] = brandId
    ? await Promise.all([
        supabase
          .from("ig_account_insights_daily")
          .select("date, profile_views")
          .eq("brand_id", brandId)
          .gte("date", params.dateFrom ?? "0001-01-01")
          .lte("date", params.dateTo ?? "9999-12-31"),
        supabase
          .from("tiktok_account_insights_daily")
          .select("date, views, likes, comments")
          .eq("brand_id", brandId)
          .gte("date", params.dateFrom ?? "0001-01-01")
          .lte("date", params.dateTo ?? "9999-12-31"),
      ])
    : [{ data: [] }, { data: [] }] as any;
  const igDaily = (igDailyRes as any).data as { date: string; profile_views: number }[] | undefined;
  const ttDaily = (ttDailyRes as any).data as { date: string; views: number; likes: number; comments?: number }[] | undefined;
  const dates = new Set<string>([
    ...(igDaily?.map((r) => r.date) ?? []),
    ...(ttDaily?.map((r) => r.date) ?? []),
  ]);
  const series: SocialSeries[] = Array.from(dates)
    .sort()
    .map((d) => ({
      date: d,
      ig: igDaily ? { views: igDaily.find((r) => r.date === d)?.profile_views ?? 0, likes: 0, comments: 0 } : undefined,
      tt: ttDaily ? { views: ttDaily.find((r) => r.date === d)?.views ?? 0, likes: ttDaily.find((r) => r.date === d)?.likes ?? 0, comments: ttDaily.find((r) => r.date === d)?.comments ?? 0 } : undefined,
    }));

  return (
    <div id="overview-root" className="space-y-8">
      {/* Header */}
      <h1 id="page-title" className="sr-only">Overview</h1>
      <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overview</h1>
      <ControlsRow
        containerId="overview-root"
        brandId={brandId}
        dateFrom={params.dateFrom}
        dateTo={params.dateTo}
        campaignId={params.campaignId}
      />

      {!brandId ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-10 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <Empty variant="pick-brand" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <section aria-label="KPIs" className="transition-opacity duration-300 data-[loading=true]:opacity-40">
            <KpiGrid kpis={kpis} />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Includes Instagram where connected.</p>
          </section>

          {/* Revenue over time */}
          <section aria-label="Revenue over time" className="transition-opacity duration-300 data-[loading=true]:opacity-40">
            <RevenueArea
              data={timeseries}
              totalLabel={`Total ${new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                timeseries.reduce((a, p) => a + p.revenue, 0)
              )}`}
              rightSlot={<RefreshDropdown brandId={brandId} from={params.dateFrom} to={params.dateTo} />}
            />
          </section>

          {/* Social overlays */}
          <section aria-label="Social overlays" className="transition-opacity duration-300 data-[loading=true]:opacity-40">
            <SocialLineChart series={series} />
          </section>

          {/* Top Influencers */}
          <section aria-label="Top influencers" className="space-y-3 transition-opacity duration-300 data-[loading=true]:opacity-40">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Influencers</h2>
            {topInfluencers.rows.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/60 bg-white p-10 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
                <Empty variant="no-influencers" />
              </div>
            ) : null}
            <TopInfluencersTable
              rows={topInfluencers.rows.map((r) => ({ ...r, platform: r.platform ?? "" }))}
              page={topInfluencers.page}
              totalPages={Math.max(Math.ceil(topInfluencers.total / topInfluencers.pageSize), 1)}
            />
          </section>
        </>
      )}
    </div>
  );
}



