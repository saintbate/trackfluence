"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Empty from "@/components/states/Empty";

type RevenuePoint = {
  date: string;
  revenue: number;
};

type RevenueOverTimeProps = {
  brandId: string;
  from?: string | null;
  to?: string | null;
  campaignId?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function RevenueOverTime({ brandId, from, to, campaignId }: RevenueOverTimeProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<RevenuePoint[]>([]);
  const searchParams = useSearchParams();
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!brandId) {
        setPoints([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ brandId });
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (campaignId) params.set("campaignId", campaignId);

        const response = await fetch(`/api/overview/revenue-timeseries?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = (await response.json()) as { ok: boolean; data: RevenuePoint[] };
        if (!payload.ok) {
          throw new Error("Unable to load revenue data");
        }

        setPoints(payload.data ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("[RevenueOverTime] load error", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setPoints([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [brandId, campaignId, from, to, searchParams]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || points.length === 0) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;
    path.getBoundingClientRect();
    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 600ms ease";
      path.style.strokeDashoffset = "0";
    });

    return () => {
      path.style.transition = "none";
    };
  }, [points]);

  const chart = useMemo(() => {
    if (points.length === 0) {
      return null;
    }

    const width = 640;
    const height = 280;
    const padding = { top: 24, right: 16, bottom: 48, left: 56 };
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;

    const maxRevenue = Math.max(...points.map((p) => p.revenue), 0);
    const denominator = points.length > 1 ? points.length - 1 : 1;

    const xForIndex = (index: number) => padding.left + (contentWidth * index) / denominator;
    const yForRevenue = (value: number) => {
      if (maxRevenue <= 0) return padding.top + contentHeight;
      const ratio = value / maxRevenue;
      return padding.top + (1 - ratio) * contentHeight;
    };

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${xForIndex(index)} ${yForRevenue(point.revenue)}`)
      .join(" ");

    const areaPath = [
      `M ${xForIndex(0)} ${padding.top + contentHeight}`,
      ...points.map((point, index) => `L ${xForIndex(index)} ${yForRevenue(point.revenue)}`),
      `L ${xForIndex(points.length - 1)} ${padding.top + contentHeight}`,
      "Z",
    ].join(" ");

    const totalRevenue = points.reduce((sum, point) => sum + point.revenue, 0);

    const tickCount = Math.min(5, points.length);
    const tickStep = points.length > 1 ? (points.length - 1) / (tickCount - 1) : 1;
    const tickIndexes = new Set<number>();
    for (let i = 0; i < tickCount; i += 1) {
      tickIndexes.add(Math.round(i * tickStep));
    }

    const ticks = Array.from(tickIndexes).sort((a, b) => a - b);

    const yTicks = 4;
    const yTickValues = Array.from({ length: yTicks }, (_, idx) => (maxRevenue / (yTicks - 1)) * idx);

    return {
      width,
      height,
      padding,
      linePath,
      areaPath,
      totalRevenue,
      ticks,
      xForIndex,
      yForRevenue,
      yTickValues,
      maxRevenue,
    };
  }, [points]);

  const totalRevenueLabel = useMemo(() => formatCurrency(points.reduce((sum, point) => sum + point.revenue, 0)), [points]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Revenue over time</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total {totalRevenueLabel}</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Loading chart…
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-sm text-amber-600 dark:text-amber-300">
            {error}
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Empty variant="no-data" />
          </div>
        ) : chart ? (
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="Revenue over time">
            <defs>
              <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(79, 70, 229, 0.25)" />
                <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
              </linearGradient>
            </defs>

            {chart.yTickValues.map((value, idx) => {
              const y = chart.yForRevenue(value);
              return (
                <g key={idx}>
                  <line
                    x1={chart.padding.left}
                    x2={chart.width - chart.padding.right}
                    y1={y}
                    y2={y}
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chart.padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-xs"
                  >
                    {formatCurrency(value)}
                  </text>
                </g>
              );
            })}

            <path d={chart.areaPath} fill="url(#revenueFill)" opacity={0.8} />
            <path
              ref={pathRef}
              d={chart.linePath}
              fill="none"
              stroke="rgb(79, 70, 229)"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {chart.ticks.map((index) => {
              const point = points[index];
              const x = chart.xForIndex(index);
              return (
                <g key={point.date}>
                  <text
                    x={x}
                    y={chart.height - chart.padding.bottom + 24}
                    textAnchor="middle"
                    className="fill-slate-400 text-xs"
                  >
                    {formatDateLabel(point.date)}
                  </text>
                  <circle cx={x} cy={chart.yForRevenue(point.revenue)} r={4} fill="white" stroke="rgb(79, 70, 229)" strokeWidth={2} />
                </g>
              );
            })}
          </svg>
        ) : null}
      </div>
    </div>
  );
}
