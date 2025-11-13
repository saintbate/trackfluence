// components/OverviewKpis.tsx
"use client";
<<<<<<< HEAD

type OverviewKpisProps = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  activeCampaigns: number;
};

const Card = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border p-4 shadow-sm">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
  </div>
);
=======
import type { KPIs } from "@/lib/kpis.shared";

export default function OverviewKpis({ kpis }: { kpis: KPIs }) {
  const items = [
    ["Total Revenue", kpis.totalRevenue.toLocaleString()],
    ["Total Spend", kpis.totalSpend.toLocaleString()],
    ["ROAS", kpis.roas.toFixed(2)],
    ["CAC", kpis.cac.toFixed(2)],
    ["Active Campaigns", String(kpis.activeCampaigns)],
  ];
>>>>>>> cursor/overview-wire

export default function OverviewKpis({
  totalSpend,
  totalRevenue,
  roas,
  cac,
  activeCampaigns,
}: OverviewKpisProps) {
  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      <Card label="Total Spend" value={`$${totalSpend.toFixed(2)}`} />
      <Card label="ROAS" value={roas > 0 ? `${roas.toFixed(2)}×` : "—"} />
      <Card label="CAC" value={`$${cac.toFixed(2)}`} />
      <Card label="Active Campaigns" value={`${activeCampaigns}`} />
=======
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border p-3">
          <div className="text-xs text-slate-500">{label}</div>
          <div className="font-semibold">{value}</div>
        </div>
      ))}
>>>>>>> cursor/overview-wire
    </div>
  );
}