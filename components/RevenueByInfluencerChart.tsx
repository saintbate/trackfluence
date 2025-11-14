// components/RevenueByInfluencerChart.tsx
"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { TooltipProps } from "recharts";
import { ReactNode } from "react";

type Point = {
  handle: string;
  revenue: number;
};

type Props = {
  data: Point[];
};

// Use proper Recharts tooltip props type
type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    value?: number;
    payload?: Point;
  }>;
  label?: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps): ReactNode {
  if (!active || !payload || payload.length === 0) return null;

  const val = payload[0]?.value as number | undefined;
  return (
    <div className="rounded-md bg-white/95 px-3 py-2 shadow-md ring-1 ring-black/5">
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm">Revenue: {val ?? 0}</div>
    </div>
  );
}

export default function RevenueByInfluencerChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <XAxis dataKey="handle" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" />
      </BarChart>
    </ResponsiveContainer>
  );
}