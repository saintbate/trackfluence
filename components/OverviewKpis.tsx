"use client";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function OverviewKpis({ brandId, from, to }:{
  brandId: string; from: string; to: string
}) {
  const { data, error, isLoading } = useSWR(
    `/api/overview?brandId=${brandId}&from=${from}&to=${to}`, fetcher
  );
  if (isLoading) return <div>Loading…</div>;
  if (error || data?.error) return <div>Error: {error?.message || data?.error}</div>;

  // Check for empty data
  if (!data.overview || data.overview.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-slate-500">
        No data available for this date range
      </div>
    );
  }

  const o = data.overview[0];
  const Card = ({ label, value }:{label:string; value:string}) => (
    <div className="rounded-xl border p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card label="Revenue" value={`$${Number(o.total_revenue).toFixed(2)}`} />
      <Card label="Orders"  value={`${o.total_orders}`} />
      <Card label="Spend"   value={`$${Number(o.total_spend).toFixed(2)}`} />
      <Card label="ROI"     value={o.roi_pct === null ? "—" : `${o.roi_pct}%`} />
    </div>
  );
}