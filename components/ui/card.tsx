// components/ui/card.tsx
import { ReactNode } from "react";
export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-white/10 bg-zinc-950/60 ${className}`}>{children}</div>;
}
export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`px-4 py-3 border-b border-white/10 ${className}`}>{children}</div>;
}
export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`text-sm font-medium text-white/80 ${className}`}>{children}</div>;
}
export {};