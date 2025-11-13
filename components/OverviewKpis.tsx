// components/OverviewKpis.tsx
"use client";
import type { KPIs } from "@/lib/kpis.shared";

export default function OverviewKpis({ kpis }: { kpis: KPIs }) {
  const items = [
    ["Total Revenue", kpis.totalRevenue.toLocaleString()],
    ["Total Spend", kpis.totalSpend.toLocaleString()],
    ["ROAS", kpis.roas.toFixed(2)],
    ["CAC", kpis.cac.toFixed(2)],
    ["Active Campaigns", String(kpis.activeCampaigns)],
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border p-3">
          <div className="text-xs text-slate-500">{label}</div>
          <div className="font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}