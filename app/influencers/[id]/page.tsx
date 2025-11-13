import { createServerClient } from "@/lib/supabase/server";
import React from "react";

export default async function InfluencerPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const id = params.id;

  const { data: influencer } = await supabase
    .from("influencer")
    .select("id, handle, platform, created_at")
    .eq("id", id)
    .maybeSingle();

  const { data: agg } = await supabase
    .from("report")
    .select("revenue, num_orders")
    .eq("influencer_id", id);

  const totals = (agg ?? []).reduce(
    (acc, r: any) => {
      acc.revenue += Number(r.revenue) || 0;
      acc.orders += Number(r.num_orders) || 0;
      return acc;
    },
    { revenue: 0, orders: 0 }
  );

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {influencer?.handle ?? "Influencer"} <span className="text-slate-400">({influencer?.platform ?? "unknown"})</span>
        </h1>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Revenue</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totals.revenue)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Orders</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{new Intl.NumberFormat().format(totals.orders)}</div>
          </div>
        </div>
      </div>
      {/* Future: embed mini chart and contributions table */}
    </div>
  );
}


