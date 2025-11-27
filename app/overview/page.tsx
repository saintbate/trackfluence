"use client";

import { MorningBrief } from "@/components/morning-brief";
import { TriageFeed } from "@/components/triage-feed";

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-200">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-8 p-6 pb-20">

        {/* Header */}
        <header className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
            Morning Brief
          </h1>
          <p className="text-xs text-zinc-500">
            Trackfluence Growth Architect — ruthless but honest guidance for creator-driven growth.
          </p>
        </header>

        {/* Morning Brief */}
        <section>
          <MorningBrief />
        </section>

        {/* Triage */}
        <section className="mt-8">
          <TriageFeed />
        </section>

      </div>
    </main>
  );
}

