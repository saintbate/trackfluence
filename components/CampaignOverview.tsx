// components/CampaignOverview.tsx
"use client";

import { useMemo, useState, useTransition } from "react";

export type Campaign = {
  id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
};

export type KPI = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  activeCampaigns: number;
};

export type InfluencerRevenue = {
  influencer_id: string;
  handle: string;
  platform: string;
  revenue: number;
  /** Some sources (your "top influencers") may not include orders */
  num_orders?: number;
};

type Props = {
  brandId: string;
  campaigns: Campaign[];
  initialKpis: KPI;
  initialTopInfluencers: InfluencerRevenue[]; // may lack num_orders
  initialRevenue: InfluencerRevenue[];        // has revenue & usually orders
  dateFrom: string;
  dateTo: string;
  /** Server action to create a campaign */
  createCampaignAction?: (data: FormData) => Promise<any>;
};

export default function CampaignOverview({
  brandId,
  campaigns,
  initialKpis,
  initialTopInfluencers,
  initialRevenue,
  dateFrom,
  dateTo,
  createCampaignAction,
}: Props) {
  const [windowFrom, setWindowFrom] = useState(dateFrom);
  const [windowTo, setWindowTo] = useState(dateTo);
  const [isPending, startTransition] = useTransition();

  // In a follow-up you can wire these to API routes that refetch using lib/kpis
  const kpis = initialKpis;
  const top = initialTopInfluencers;
  const revenueByInf = initialRevenue;

  const totals = useMemo(() => {
    const totalOrders = revenueByInf.reduce(
      (s, r) => s + (r.num_orders ?? 0),
      0
    );
    return { totalOrders };
  }, [revenueByInf]);

  function onCreateCampaign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("brand_id", brandId);

    startTransition(async () => {
      if (createCampaignAction) {
        await createCampaignAction(fd);
      }
      // consider router.refresh() if needed
    });
  }

  return (
    <section>
      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Total Revenue" value={`$${kpis.totalRevenue.toFixed(2)}`} />
        <KpiCard label="Total Spend" value={`$${kpis.totalSpend.toFixed(2)}`} />
        <KpiCard label="ROAS" value={kpis.roas.toFixed(2)} />
        <KpiCard label="CAC" value={`$${kpis.cac.toFixed(2)}`} />
        <KpiCard label="Active Campaigns" value={String(kpis.activeCampaigns)} />
      </div>

      {/* Date window controls (placeholder) */}
      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={windowFrom}
          onChange={(e) => setWindowFrom(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
        />
        <input
          type="date"
          value={windowTo}
          onChange={(e) => setWindowTo(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
        />
      </div>

      {/* Campaigns list + quick create */}
      <div className="mb-6 rounded-lg border p-3">
        <div className="mb-2 font-medium">Campaigns</div>
        {campaigns.length === 0 ? (
          <div className="text-sm text-slate-500">No campaigns yet.</div>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((c) => (
              <li key={c.id} className="rounded-md border p-2 text-sm">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">
                  {c.start_date} → {c.end_date}
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={onCreateCampaign} className="mt-3 flex flex-wrap gap-2">
          <input
            name="name"
            required
            placeholder="Campaign name"
            className="min-w-0 flex-1 rounded-md border px-3 py-1 text-sm"
          />
          <input
            type="date"
            name="start_date"
            required
            className="rounded-md border px-2 py-1 text-sm"
            defaultValue={dateFrom}
          />
          <input
            type="date"
            name="end_date"
            required
            className="rounded-md border px-2 py-1 text-sm"
            defaultValue={dateTo}
          />
          <button
            disabled={isPending}
            className="rounded-md bg-black px-3 py-1 text-sm text-white disabled:opacity-60"
          >
            {isPending ? "Creating…" : "Add campaign"}
          </button>
        </form>
      </div>

      {/* Top influencers */}
      <div className="mb-6 rounded-lg border p-3">
        <div className="mb-2 font-medium">Top Influencers (by revenue)</div>
        {top.length === 0 ? (
          <div className="text-sm text-slate-500">No data.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="py-1">Handle</th>
                <th className="py-1">Platform</th>
                <th className="py-1">Revenue</th>
                <th className="py-1">Orders</th>
              </tr>
            </thead>
            <tbody>
              {top.map((r) => (
                <tr key={r.influencer_id} className="border-t">
                  <td className="py-1">@{r.handle}</td>
                  <td className="py-1">{r.platform}</td>
                  <td className="py-1">${r.revenue.toFixed(2)}</td>
                  <td className="py-1">{r.num_orders ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-2 text-xs text-slate-500">
          Total attributed orders: {totals.totalOrders}
        </div>
      </div>
    </section>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}