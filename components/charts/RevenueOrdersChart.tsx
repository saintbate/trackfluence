"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Empty from "@/components/states/Empty";

type Point = { date: string; revenue: number; orders: number };

type Props = {
  brandId: string;
  from?: string | null;
  to?: string | null;
  campaignId?: string | null;
};

export default function RevenueOrdersChart({ brandId, from, to, campaignId }: Props) {
  const [animate, setAnimate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [totals, setTotals] = useState<{ revenue: number; orders: number }>({ revenue: 0, orders: 0 });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      if (!brandId) {
        setPoints([]);
        setTotals({ revenue: 0, orders: 0 });
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ brandId });
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (campaignId) params.set("campaignId", campaignId);
        const res = await fetch(`/api/overview/revenue-orders-timeseries?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const json = (await res.json()) as {
          ok: boolean;
          points: Point[];
          totals: { revenue: number; orders: number };
        };
        if (!json.ok) throw new Error("Request failed");
        setPoints(json.points ?? []);
        setTotals(json.totals ?? { revenue: 0, orders: 0 });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setPoints([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [brandId, from, to, campaignId]);

  const hasData = points.length > 0;
  const totalRevenueLabel = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(totals.revenue || 0),
    [totals.revenue]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Revenue & Orders over time</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total {totalRevenueLabel}</p>
        </div>
        <label className="inline-flex select-none items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={animate}
            onChange={(e) => setAnimate(e.target.checked)}
            className="h-3.5 w-3.5 accent-indigo-600"
          />
          Animate
        </label>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        {loading ? (
          <div className="flex h-72 items-center justify-center text-sm text-slate-500 dark:text-slate-400">Loading chart…</div>
        ) : error ? (
          <div className="flex h-72 items-center justify-center text-sm text-amber-600 dark:text-amber-300">{error}</div>
        ) : !hasData ? (
          <div className="flex h-72 items-center justify-center">
            <Empty
              title="No data in this date range"
              hint="Try expanding the range or clear the campaign filter."
            />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  stroke="rgba(148,163,184,.4)"
                />
                <YAxis
                  yAxisId="left"
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  stroke="rgba(148,163,184,.4)"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  stroke="rgba(148,163,184,.4)"
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={animate}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={animate}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}


