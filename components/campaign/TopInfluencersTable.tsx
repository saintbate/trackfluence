"use client";

import * as React from "react";

export type Row = {
  influencer_name: string;
  platform: string;
  revenue: number;
  orders: number;
};

export default function TopInfluencersForCampaign({ rows = [] as Row[] }: { rows?: Row[] }) {
  function fmtCurrency(n: number) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
  }
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Influencer</th>
              <th className="px-4 py-3 text-left">Platform</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                  No influencers yet
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.influencer_name}</td>
                  <td className="px-4 py-3">{r.platform}</td>
                  <td className="px-4 py-3 text-right">{fmtCurrency(r.revenue)}</td>
                  <td className="px-4 py-3 text-right">{r.orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


