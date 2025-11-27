import type { GrowthArchitectInsight } from "@/lib/ai/growth-architect";
import { TriageCard } from "./triage-card";

const MOCK_INSIGHTS: GrowthArchitectInsight[] = [
  {
    mode: "red",
    summary:
      "STOP spend on @CreatorA — $520 in spend, zero tracked revenue in the last 7 days.",
    reasoning:
      "Engagement looks decent on the surface, but clicks are near zero and comment quality suggests bots or misaligned audience.",
    next_action:
      "Pause all renewals with @CreatorA, reallocate that budget to the top 2 creators by ROAS, and re-evaluate their audience quality later.",
  },
  {
    mode: "yellow",
    summary:
      "@CreatorB is driving strong interest but the landing page is leaking conversions.",
    reasoning:
      "Swipe-through and click metrics are healthy, but too few visitors reach checkout. The drop-off suggests a slow page or confusing hero section.",
    next_action:
      "Run a simple A/B: shorten the hero copy, move the main CTA above the fold, and test a risk-reversal line like "30-day money-back guarantee."",
  },
  {
    mode: "green",
    summary:
      "@CreatorC is profitably driving customers well below target CPA.",
    reasoning:
      "Their content format matches your ideal customer, and the comments show real purchase intent plus social proof.",
    next_action:
      "Lock in @CreatorC with a 2–3 month ambassador deal and allocate an extra 25–50% budget to their next two campaigns while monitoring ROAS.",
  },
];

export async function TriageFeed() {
  const insights = MOCK_INSIGHTS;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-300">
          Triage Feed
        </h2>
        <p className="text-xs text-zinc-500">
          Prioritized actions based on your current performance.
        </p>
      </div>
      <div className="space-y-2.5">
        {insights.map((insight, idx) => (
          <TriageCard key={idx} insight={insight} />
        ))}
      </div>
    </section>
  );
}

