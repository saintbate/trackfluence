// components/TopInfluencers.tsx
"use client";

type Row = {
  influencer_id: string;
  handle: string;
  platform: string | null;
  revenue: number;
  num_orders: number;
};

export default function TopInfluencers({ rows }: { rows: Row[] }) {
  return (
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
    </div>
  );
}