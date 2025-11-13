// components/TopInfluencers.tsx
"use client";
<<<<<<< HEAD
import ExportCsvButton from "./ExportCsvButton";

type TopInfluencerRow = {
  influencer_id: string;
  name: string;
  revenue: number;
  spend: number;
  roas: number;
};

type TopInfluencersProps = {
  rows: TopInfluencerRow[];
};

// Helper function to get ROAS badge color
function getRoasBadgeClass(roas: number): string {
  if (roas >= 5) return "bg-emerald-100 text-emerald-700";
  if (roas >= 3) return "bg-green-100 text-green-700";
  if (roas >= 2) return "bg-yellow-100 text-yellow-700";
  if (roas >= 1) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function TopInfluencers({ rows }: TopInfluencersProps) {
  // Check for empty data
  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-8 text-center text-slate-500">
        No influencer data available
      </div>
    );
  }

  // Calculate totals
  const totals = rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.revenue,
      spend: acc.spend + r.spend,
    }),
    { revenue: 0, spend: 0 }
  );

  const totalRoas = totals.spend > 0 ? totals.revenue / totals.spend : 0;

  // Prepare CSV data
  const csvData = rows.map((r) => ({
    name: r.name,
    revenue: r.revenue.toFixed(2),
    spend: r.spend.toFixed(2),
    roas: r.roas.toFixed(2),
  }));
=======

type Row = {
  influencer_id: string;
  handle: string;
  platform: string | null;
  revenue: number;
  num_orders: number;
};
>>>>>>> cursor/overview-wire

export default function TopInfluencers({ rows }: { rows: Row[] }) {
  return (
<<<<<<< HEAD
    <div className="mt-6">
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
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.influencer_id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-right">${r.revenue.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">${r.spend.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoasBadgeClass(r.roas)}`}
                  >
                    {r.roas.toFixed(2)}×
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr className="font-semibold">
              <td className="px-4 py-3 text-left">Total</td>
              <td className="px-4 py-3 text-right">${totals.revenue.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">${totals.spend.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                {totalRoas > 0 ? (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoasBadgeClass(totalRoas)}`}
                  >
                    {totalRoas.toFixed(2)}×
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
=======
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-[600px] w-full text-sm">
        <thead className="text-left bg-slate-50">
          <tr>
            <th className="p-2">Influencer</th>
            <th className="p-2">Platform</th>
            <th className="p-2">Revenue</th>
            <th className="p-2">Orders</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.influencer_id} className="border-t">
              <td className="p-2">{r.handle}</td>
              <td className="p-2">{r.platform ?? "—"}</td>
              <td className="p-2">{r.revenue.toLocaleString()}</td>
              <td className="p-2">{r.num_orders}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-3 text-slate-500">
                No rows in this date range yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
>>>>>>> cursor/overview-wire
    </div>
  );
}
