"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Row = {
  influencer_id: string;
  handle: string;
  platform: string;
  revenue: number;
  num_orders: number;
};

type Props = {
  rows?: Row[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

function fmtCurrency(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function TopInfluencersTable({
  rows = [],
  page = 1,
  totalPages = 1,
  onPageChange,
}: Props) {
  const router = useRouter();
  const [announce, setAnnounce] = React.useState<string | null>(null);

  function go(href: string) {
    setAnnounce("Opening influencer details…");
    router.push(href);
  }

  return (
    <div className="space-y-3">
      {/* a11y live region */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>

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
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  No influencers yet
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.influencer_id}
                  className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => go(`/influencers/${r.influencer_id}`)}
                >
                  <td className="px-4 py-3">{r.handle}</td>
                  <td className="px-4 py-3">{r.platform}</td>
                  <td className="px-4 py-3 text-right">
                    {fmtCurrency(r.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right">{r.num_orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* simple pager */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button
          className="rounded border border-white/10 px-2 py-1 disabled:opacity-40"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="rounded border border-white/10 px-2 py-1 disabled:opacity-40"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}