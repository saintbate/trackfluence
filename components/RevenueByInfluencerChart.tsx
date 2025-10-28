"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type ChartRow = {
  handle: string;
  revenue: number;
};

type RevenueByInfluencerChartProps = {
  rows: ChartRow[];
};

// Color palette for bars
const COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
];

export default function RevenueByInfluencerChart({ rows }: RevenueByInfluencerChartProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  // Format data for recharts
  const chartData = rows.map((row) => ({
    handle: row.handle,
    revenue: Number(row.revenue),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].payload.handle}</p>
          <p className="text-sm text-slate-600">
            Revenue: <span className="font-medium text-slate-900">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-6 rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Influencer</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="handle"
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
    </div>
  );
}


