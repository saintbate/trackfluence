"use client";

import { useEffect, useState } from "react";
import { useCompletion } from "ai/react";
import { Loader2, SunMedium } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { GrowthArchitectInsight } from "@/lib/ai/growth-architect";

interface MorningBriefProps {
  // later: normalizedData?: unknown;
}

export function MorningBrief(props: MorningBriefProps) {
  const [insights, setInsights] = useState<GrowthArchitectInsight[] | null>(
    null,
  );

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/morning-brief",
  });

  useEffect(() => {
    complete(
      JSON.stringify({
        // normalizedData: props.normalizedData ?? null,
      }),
    );
  }, [complete]);

  useEffect(() => {
    if (!completion) return;
    try {
      const parsed = JSON.parse(completion) as GrowthArchitectInsight[];
      setInsights(parsed);
    } catch {
      // ignore until valid JSON
    }
  }, [completion]);

  const primaryInsight = insights?.[0];

  return (
    <Card className="border border-zinc-800 bg-zinc-950/70 text-zinc-100 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900">
            <SunMedium className="h-4 w-4 text-amber-300" />
          </span>
          <CardTitle className="text-sm font-medium tracking-wide text-zinc-200">
            Morning Brief
          </CardTitle>
        </div>
        {isLoading && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-300">
        {primaryInsight ? (
          <>
            <p className="text-base font-medium text-zinc-100">
              {primaryInsight.summary}
            </p>
            <p className="text-sm text-zinc-400">{primaryInsight.reasoning}</p>
            <p className="text-sm font-medium text-zinc-100">
              Next action:{" "}
              <span className="font-normal text-zinc-300">
                {primaryInsight.next_action}
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            {isLoading
              ? "Generating your morning brief..."
              : "No brief generated yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

