// components/KpiCard.tsx
"use client";

import React from "react";

type Props =
  | { label: string; value: number; format?: "currency" | "int" | "ratio" }
  | { label: string; value: null | undefined; format?: "currency" | "int" | "ratio" };

function formatValue(value: number | null | undefined, format: Props["format"]) {
  const v = typeof value === "number" ? value : 0;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(v);
    case "ratio":
      // show 2 decimals, e.g., 3.45x
      return `${v.toFixed(2)}x`;
    case "int":
    default:
      return new Intl.NumberFormat().format(v);
  }
}

export default function KpiCard({ label, value, format = "int" }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200/10 bg-slate-800/40 p-4 shadow-sm ring-1 ring-inset ring-white/5">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">
        {formatValue(value as number, format)}
      </div>
    </div>
  );
}