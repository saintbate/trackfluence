"use client";

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

export default function OverviewKpis({
  totalSpend,
  totalRevenue,
  roas,
  cac,
  activeCampaigns,
}: OverviewKpisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      <Card label="Total Spend" value={`$${totalSpend.toFixed(2)}`} />
      <Card label="ROAS" value={roas > 0 ? `${roas.toFixed(2)}×` : "—"} />
      <Card label="CAC" value={`$${cac.toFixed(2)}`} />
      <Card label="Active Campaigns" value={`${activeCampaigns}`} />
    </div>
  );
}