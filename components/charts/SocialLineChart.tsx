"use client";

import Empty from "@/components/states/Empty";
import { useMemo, useState } from "react";

export type SocialSeries = {
  date: string;
  ig?: { views: number; likes: number; comments?: number };
  tt?: { views: number; likes: number; comments?: number; shares?: number };
};

export default function SocialLineChart({ series }: { series: SocialSeries[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const data = series;

  const chart = useMemo(() => {
    if (!data || data.length === 0) return null;
    const width = 720;
    const height = 320;
    const padding = { top: 24, right: 16, bottom: 48, left: 56 };
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;
    const values = data.flatMap((d) => [
      d.ig?.views ?? 0,
      d.ig?.likes ?? 0,
      d.tt?.views ?? 0,
      d.tt?.likes ?? 0,
    ]);
    const maxY = Math.max(...values, 0);
    const denom = Math.max(1, data.length - 1);
    const x = (i: number) => padding.left + (contentWidth * i) / denom;
    const y = (v: number) => padding.top + (1 - (maxY ? v / maxY : 0)) * contentHeight;
    const pathFor = (sel: (d: SocialSeries) => number | undefined) =>
      data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(sel(d) ?? 0)}`).join(" ");
    const yTicks = 4;
    const yTickValues = Array.from({ length: yTicks }, (_, idx) => (maxY / (yTicks - 1)) * idx);
    const ticks = 5;
    const xTickIdx = Array.from({ length: ticks }, (_, i) => Math.round((i * (data.length - 1)) / (ticks - 1)));
    return { width, height, padding, x, y, pathFor, yTickValues, xTickIdx, maxY };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex h-64 items-center justify-center">
          <Empty title="No social data for this range" hint="Try ‘Refresh Social’ after connecting your accounts." />
        </div>
      </div>
    );
  }

  const igViews = chart!.pathFor((d) => d.ig?.views);
  const igLikes = chart!.pathFor((d) => d.ig?.likes);
  const ttViews = chart!.pathFor((d) => d.tt?.views);
  const ttLikes = chart!.pathFor((d) => d.tt?.likes);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Social activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Instagram and TikTok where connected</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <svg viewBox={`0 0 ${chart!.width} ${chart!.height}`} role="img" aria-label="Social activity over time">
          {chart!.yTickValues.map((v, idx) => {
            const y = chart!.y(v);
            return (
              <g key={idx}>
                <line x1={chart!.padding.left} x2={chart!.width - chart!.padding.right} y1={y} y2={y} stroke="rgba(148,163,184,0.25)" strokeDasharray="3 3" />
                <text x={chart!.padding.left - 10} y={y + 4} textAnchor="end" className="fill-slate-400 text-xs">
                  {Math.round(v).toLocaleString()}
                </text>
              </g>
            );
          })}
          {/* IG Views (solid indigo) */}
          <path d={igViews} fill="none" stroke="rgb(79,70,229)" strokeWidth={2} strokeLinecap="round" />
          {/* IG Likes (lighter indigo) */}
          <path d={igLikes} fill="none" stroke="rgba(79,70,229,0.6)" strokeWidth={2} strokeLinecap="round" strokeDasharray="5 3" />
          {/* TikTok Views (solid rose) */}
          <path d={ttViews} fill="none" stroke="rgb(244,63,94)" strokeWidth={2} strokeLinecap="round" />
          {/* TikTok Likes (dashed rose) */}
          <path d={ttLikes} fill="none" stroke="rgba(244,63,94,0.7)" strokeWidth={2} strokeLinecap="round" strokeDasharray="5 3" />
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
            const cy = chart!.y(Math.max(p.ig?.views ?? 0, p.tt?.views ?? 0));
            return (
              <g key={p.date} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                <circle cx={cx} cy={cy} r={3} fill="white" stroke="rgb(79,70,229)" strokeWidth={2} />
                {hoverIdx === i ? (
                  <g transform={`translate(${cx + 8}, ${cy - 36})`}>
                    <rect width="220" height="58" rx="6" className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700" />
                    <text x={8} y={14} className="fill-slate-700 dark:fill-slate-200 text-xs">
                      {new Date(p.date).toLocaleDateString()}
                    </text>
                    <text x={8} y={28} className="fill-slate-500 dark:fill-slate-400 text-[10px]">
                      IG: {p.ig?.views ?? 0} views, {p.ig?.likes ?? 0} likes
                    </text>
                    <text x={8} y={42} className="fill-slate-500 dark:fill-slate-400 text-[10px]">
                      TikTok: {p.tt?.views ?? 0} views, {p.tt?.likes ?? 0} likes
                    </text>
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


