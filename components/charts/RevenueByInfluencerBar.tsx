// components/charts/RevenueByInfluencerBar.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Row = { handle: string; revenue: number };

export default function RevenueByInfluencerBar({ rows }: { rows: Row[] }) {
  // take top 8 for readability
  const data = rows.slice(0, 8).map(r => ({ name: r.handle, revenue: Number(r.revenue || 0) }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Influencer</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }}
              labelStyle={{ color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Bar dataKey="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}