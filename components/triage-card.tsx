import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { TrafficLightBadge } from "./traffic-light-badge";
import type { GrowthArchitectInsight } from "@/lib/ai/growth-architect";

interface TriageCardProps {
  insight: GrowthArchitectInsight;
}

export function TriageCard({ insight }: TriageCardProps) {
  const borderColor =
    insight.mode === "red"
      ? "border-red-500/60"
      : insight.mode === "yellow"
      ? "border-amber-400/60"
      : "border-emerald-500/60";

  return (
    <Card
      className={`group flex border border-zinc-800 bg-zinc-950/70 text-zinc-100 shadow-sm ${borderColor} border-l-4`}
    >
      <CardContent className="flex flex-1 flex-col gap-2 py-3 pl-3 pr-3">
        <div className="flex items-center justify-between gap-2">
          <TrafficLightBadge mode={insight.mode} />
        </div>
        <p className="text-sm font-medium text-zinc-100">
          {insight.summary}
        </p>
        <p className="text-xs text-zinc-400">{insight.reasoning}</p>
        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-zinc-300">
          <ArrowRight className="h-3 w-3 text-zinc-400" />
          <span>{insight.next_action}</span>
        </div>
      </CardContent>
    </Card>
  );
}

