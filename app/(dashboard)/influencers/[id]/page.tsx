import { getInfluencerBasics, getInfluencerTimeseries, getInfluencerActivity } from "@/lib/influencers";
import RevenueArea from "@/components/charts/RevenueArea";
import SimplePager from "@/components/pagers/SimplePager";
import Empty from "@/components/states/Empty";
import Link from "next/link";
import { fmtCurrency, fmtInt } from "@/lib/format";

function readParam(search: Record<string, string | string[] | undefined>, key: string): string | null {
  const v = search[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default async function InfluencerShowPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id: influencerId } = await params;
  const s = await searchParams;
  const brandId = readParam(s ?? {}, "brandId");
  const dateFrom = readParam(s ?? {}, "dateFrom") ?? undefined;
  const dateTo = readParam(s ?? {}, "dateTo") ?? undefined;
  const campaignId = readParam(s ?? {}, "campaignId") ?? undefined;
  const page = Math.max(parseInt(readParam(s ?? {}, "page") ?? "1", 10) || 1, 1);
  if (!brandId) {
    return (
      <div className="space-y-4">
        <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">Influencer</h1>
        <Empty title="Pick a brand" hint="Select a brand on the Overview page first." />
        <Link href="/overview" className="text-sm text-indigo-600 hover:underline">Back to Overview</Link>
      </div>
    );
  }

  const basics = await getInfluencerBasics(influencerId);
  if (!basics) {
    return (
      <div className="space-y-4">
        <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">Influencer</h1>
        <Empty title="Influencer not found" hint="This influencer does not exist or you do not have access." />
        <Link href="/overview" className="text-sm text-indigo-600 hover:underline">Back to Overview</Link>
      </div>
    );
  }

  const [series, activity] = await Promise.all([
    getInfluencerTimeseries({ influencerId, brandId, from: dateFrom, to: dateTo, campaignId: campaignId ?? undefined }),
    getInfluencerActivity({ influencerId, brandId, from: dateFrom, to: dateTo, campaignId: campaignId ?? undefined, page, pageSize: 20 }),
  ]);

  const total = series.reduce((a, p) => a + p.revenue, 0);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/overview" className="hover:underline">Overview</Link>
        <span className="mx-1">/</span>
        <Link href="/influencers" className="hover:underline">Influencers</Link>
        <span className="mx-1">/</span>
        <span>{basics.handle}</span>
      </nav>

      <header>
        <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {basics.handle} <span className="text-slate-500">({basics.platform ?? "unknown"})</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Revenue in selected date range</p>
      </header>

      <section aria-label="Revenue over time">
        <RevenueArea data={series.map((p) => ({ date: p.d, revenue: p.revenue }))} totalLabel={`Total ${fmtCurrency(total)}`} />
      </section>

      <section aria-label="Activity">
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white ring-1 ring-inset ring-black/5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 dark:ring-white/5">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 dark:bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">URL</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {activity.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    <Empty variant="no-data" />
                  </td>
                </tr>
              ) : (
                activity.rows.map((row, idx) => {
                  const date =
                    row.period_start && row.period_end
                      ? `${new Date(row.period_start).toLocaleDateString()} – ${new Date(row.period_end).toLocaleDateString()}`
                      : row.period_start
                      ? new Date(row.period_start).toLocaleDateString()
                      : "";
                  const host = row.url ? (() => { try { return new URL(row.url).hostname; } catch { return row.url; } })() : "—";
                  return (
                    <tr key={`${row.period_start ?? ""}-${idx}`} className="odd:bg-slate-50/50 dark:odd:bg-slate-800/30">
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{date}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{row.campaign?.name ?? row.campaign_id ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 truncate max-w-[240px]">{host}</td>
                      <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-slate-100">{fmtCurrency(Number(row.revenue) || 0)}</td>
                      <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-slate-100">{fmtInt(Number(row.num_orders) || 0)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="border-t border-slate-200/60 bg-white p-2 dark:border-slate-800/60 dark:bg-slate-900">
            <SimplePager page={activity.page} pageSize={activity.pageSize} total={activity.total} />
          </div>
        </div>
      </section>
    </div>
  );
}



