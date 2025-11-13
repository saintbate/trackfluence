"use client";

import { useMemo, useRef, useState } from "react";
import Empty from "@/components/states/Empty";

type Point = { date: string; revenue: number };
type TikTokMap = Record<string, { views?: number; likes?: number }>;

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function RevenueArea({ data, totalLabel, tiktok, rightSlot }: { data: Point[]; totalLabel: string; tiktok?: TikTokMap; rightSlot?: React.ReactNode }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const chart = useMemo(() => {
    if (!data || data.length === 0) return null;
    const width = 720;
    const height = 320;
    const padding = { top: 24, right: 16, bottom: 48, left: 56 };
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;
    const maxY = Math.max(...data.map((d) => d.revenue), 0);
    const denom = Math.max(1, data.length - 1);
    const x = (i: number) => padding.left + (contentWidth * i) / denom;
    const y = (v: number) => padding.top + (1 - (maxY ? v / maxY : 0)) * contentHeight;
    const areaPath = [
      `M ${x(0)} ${y(0)}`,
      ...data.map((d, i) => `L ${x(i)} ${y(d.revenue)}`),
      `L ${x(data.length - 1)} ${y(0)}`,
      "Z",
    ].join(" ");
    const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.revenue)}`).join(" ");
    const yTicks = 4;
    const yTickValues = Array.from({ length: yTicks }, (_, idx) => (maxY / (yTicks - 1)) * idx);
    const ticks = 5;
    const xTickIdx = Array.from({ length: ticks }, (_, i) => Math.round((i * (data.length - 1)) / (ticks - 1)));
    return { width, height, padding, x, y, areaPath, linePath, yTickValues, xTickIdx, maxY };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex h-64 items-center justify-center">
          <Empty title="No data in this date range" hint="Try expanding the range or selecting a different campaign." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Revenue over time</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{totalLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {rightSlot}
          <button
          type="button"
          onClick={() => {
            const header = "date,revenue\n";
            const rows = data.map((d) => `${d.date},${d.revenue}`).join("\n");
            const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "revenue_timeseries.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <svg ref={svgRef} viewBox={`0 0 ${chart!.width} ${chart!.height}`} role="img" aria-label="Revenue over time">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(79,70,229,0.28)" />
              <stop offset="100%" stopColor="rgba(79,70,229,0)" />
            </linearGradient>
          </defs>
          {chart!.yTickValues.map((v, idx) => {
            const y = chart!.y(v);
            return (
              <g key={idx}>
                <line
                  x1={chart!.padding.left}
                  x2={chart!.width - chart!.padding.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(148,163,184,0.25)"
                  strokeDasharray="3 3"
                />
                <text x={chart!.padding.left - 10} y={y + 4} textAnchor="end" className="fill-slate-400 text-xs">
                  {formatCurrency(v)}
                </text>
              </g>
            );
          })}
          <path d={chart!.areaPath} fill="url(#areaFill)" opacity={0.9} />
          <path
            d={chart!.linePath}
            fill="none"
            stroke="rgb(79,70,229)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ transition: prefersReduced ? "none" : "stroke-dashoffset 450ms ease" }}
          />
          {chart!.xTickIdx.map((i) => {
            const p = data[i];
            const x = chart!.x(i);
            return (
              <text key={i} x={x} y={chart!.height - chart!.padding.bottom + 24} textAnchor="middle" className="fill-slate-400 text-xs">
                {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </text>
            );
          })}
          {data.map((p, i) => {
            const cx = chart!.x(i);
            const cy = chart!.y(p.revenue);
            return (
              <g key={p.date} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                <circle cx={cx} cy={cy} r={3} fill="white" stroke="rgb(79,70,229)" strokeWidth={2} />
                {hoverIdx === i ? (
                  <g transform={`translate(${cx + 8}, ${cy - 24})`}>
                    <rect width="200" height={tiktok ? 64 : 36} rx="6" className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700" />
                    <text x={8} y={14} className="fill-slate-700 dark:fill-slate-200 text-xs">
                      {new Date(p.date).toLocaleDateString()}
                    </text>
                    <text x={8} y={28} className="fill-slate-500 dark:fill-slate-400 text-xs">
                      {formatCurrency(p.revenue)}
                    </text>
                    {tiktok && tiktok[p.date] ? (
                      <foreignObject x={8} y={34} width="184" height="28">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          TikTok Views: {tiktok[p.date]?.views ?? 0} · Likes: {tiktok[p.date]?.likes ?? 0}
                        </div>
                      </foreignObject>
                    ) : null}
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}


