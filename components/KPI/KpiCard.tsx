"use client";

import * as React from "react";

type Props = {
  label: string;
  value: number | undefined | null;
  format?: "currency" | "ratio" | "int";
  hint?: string;
  icon?: React.ReactNode;
};

function fmt(value: number | undefined | null, format: Props["format"]) {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  switch (format) {
    case "currency":
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
    case "ratio":
      return `${n.toFixed(2)}x`;
    case "int":
      return new Intl.NumberFormat().format(Math.round(n));
    default:
      return String(n);
  }
}

export default function KpiCard({ label, value, format, hint, icon }: Props) {
  return (
    <div className="rounded-xl border border-white/10 p-4 shadow-sm bg-black/20">
      <div className="flex items-center justify-between text-slate-300 text-xs">
        <span>{label}</span>
        {hint ? <span className="text-slate-500">{hint}</span> : null}
      </div>
      <div className="mt-2 flex items-end gap-2">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        <span className="text-2xl font-semibold">{fmt(value, format)}</span>
      </div>
    </div>
  );
}