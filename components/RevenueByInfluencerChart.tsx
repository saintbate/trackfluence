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

<<<<<<< HEAD
type RevenueByInfluencerPoint = {
  name: string;
  revenue: number;
};

type RevenueByInfluencerChartProps = {
  points: RevenueByInfluencerPoint[];
=======
type Point = {
  handle: string;
  revenue: number;
};

type Props = {
  data: Point[];
>>>>>>> cursor/overview-wire
};

// Use proper Recharts tooltip props type
type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    value?: number;
    payload?: Point;
  }>;
  label?: string;
};

<<<<<<< HEAD
export default function RevenueByInfluencerChart({ points }: RevenueByInfluencerChartProps) {
  if (!points || points.length === 0) {
    return null;
  }

  // Format data for recharts
  const chartData = points.map((point) => ({
    name: point.name,
    revenue: point.revenue,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].payload.name}</p>
          <p className="text-sm text-slate-600">
            Revenue: <span className="font-medium text-slate-900">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
=======
function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps): ReactNode {
  if (!active || !payload || payload.length === 0) return null;
>>>>>>> cursor/overview-wire

  const val = payload[0]?.value as number | undefined;
  return (
<<<<<<< HEAD
    <div className="mb-6 rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Influencer</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
=======
    <div className="rounded-md bg-white/95 px-3 py-2 shadow-md ring-1 ring-black/5">
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm">Revenue: {val ?? 0}</div>
>>>>>>> cursor/overview-wire
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