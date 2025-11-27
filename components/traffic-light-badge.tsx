import { Badge } from "@/components/ui/badge";
import type { GrowthArchitectMode } from "@/lib/ai/growth-architect";

interface TrafficLightBadgeProps {
  mode: GrowthArchitectMode;
}

const labelByMode: Record<GrowthArchitectMode, string> = {
  red: "Red • Stop",
  yellow: "Yellow • Fix",
  green: "Green • Scale",
};

export function TrafficLightBadge({ mode }: TrafficLightBadgeProps) {
  const base =
    "border px-2.5 py-0.5 text-[11px] font-medium tracking-wide rounded-full";

  if (mode === "red") {
    return (
      <Badge
        variant="outline"
        className={`${base} border-red-500/60 bg-red-500/10 text-red-300`}
      >
        {labelByMode[mode]}
      </Badge>
    );
  }

  if (mode === "yellow") {
    return (
      <Badge
        variant="outline"
        className={`${base} border-amber-400/60 bg-amber-400/10 text-amber-200`}
      >
        {labelByMode[mode]}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`${base} border-emerald-500/60 bg-emerald-500/10 text-emerald-200`}
    >
      {labelByMode[mode]}
    </Badge>
  );
}

