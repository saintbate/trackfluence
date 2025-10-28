"use client";
import useSWR from "swr";
import ExportCsvButton from "./ExportCsvButton";
import RevenueByInfluencerChart from "./RevenueByInfluencerChart";

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Helper function to get ROAS badge color
function getRoasBadgeClass(roas: number | null): string {
  if (roas === null) return "bg-slate-100 text-slate-600";
  if (roas >= 5) return "bg-emerald-100 text-emerald-700";
  if (roas >= 3) return "bg-green-100 text-green-700";
  if (roas >= 2) return "bg-yellow-100 text-yellow-700";
  if (roas >= 1) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function TopInfluencers({ brandId, from, to }:{
  brandId: string; from: string; to: string
}) {
  const { data, error, isLoading } = useSWR(
    `/api/overview?brandId=${brandId}&from=${from}&to=${to}`, fetcher
  );
  if (isLoading) return <div>Loading…</div>;
  if (error || data?.error) return <div>Error: {error?.message || data?.error}</div>;

  const rows = data.top ?? [];
  
  // Check for empty data
  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-8 text-center text-slate-500">
        No data available for this date range
      </div>
    );
  }

  // Calculate totals
  const totals = rows.reduce((acc: any, r: any) => ({
    revenue: acc.revenue + Number(r.revenue),
    orders: acc.orders + Number(r.orders),
    spend: acc.spend + Number(r.spend || 0),
  }), { revenue: 0, orders: 0, spend: 0 });

  const totalRoas = totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : null;

  // Prepare CSV data
  const csvData = rows.map((r: any) => ({
    handle: r.handle,
    revenue: Number(r.revenue).toFixed(2),
    orders: r.orders,
    spend: Number(r.spend || 0).toFixed(2),
    roas: r.roas === null ? "" : r.roas
  }));

  // Prepare chart data
  const chartData = rows.map((r: any) => ({
    handle: r.handle,
    revenue: Number(r.revenue)
  }));

  return (
    <div className="mt-6">
      {/* Chart */}
      <RevenueByInfluencerChart rows={chartData} />

      {/* Export Button */}
      <div className="mb-3 flex justify-end">
        <ExportCsvButton data={csvData} filename="influencers.csv" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left">Influencer</th>
            <th className="px-4 py-3 text-right">Revenue</th>
            <th className="px-4 py-3 text-right">Orders</th>
            <th className="px-4 py-3 text-right">Spend</th>
            <th className="px-4 py-3 text-right">ROAS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any, i:number) => (
            <tr key={i} className="border-t hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{r.handle}</td>
              <td className="px-4 py-3 text-right">${Number(r.revenue).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{r.orders}</td>
              <td className="px-4 py-3 text-right">${Number(r.spend || 0).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                {r.roas === null ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    —
                  </span>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoasBadgeClass(parseFloat(r.roas))}`}>
                    {r.roas}×
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 border-t-2 border-slate-300">
          <tr className="font-semibold">
            <td className="px-4 py-3 text-left">Total</td>
            <td className="px-4 py-3 text-right">${totals.revenue.toFixed(2)}</td>
            <td className="px-4 py-3 text-right">{totals.orders}</td>
            <td className="px-4 py-3 text-right">${totals.spend.toFixed(2)}</td>
            <td className="px-4 py-3 text-right">
              {totalRoas ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoasBadgeClass(parseFloat(totalRoas))}`}>
                  {totalRoas}×
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  —
                </span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
}