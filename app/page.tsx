// app/page.tsx

import { Suspense } from "react";
import { FlaskConical } from "lucide-react";
import MorningBrief from "@/components/morning-brief";
import TriageFeed from "@/components/triage-feed";
import DemoBanner from "@/components/demo-banner";
import { isDemoSearchParam } from "@/lib/demo-mode";
import { getDemoOverviewData } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isDemo = isDemoSearchParam(params);

  // Load demo data if in demo mode, otherwise show placeholder state
  const demoData = isDemo ? await getDemoOverviewData() : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-8">
        
        {/* Demo Banner */}
        {isDemo && (
          <Suspense fallback={null}>
            <div className="flex justify-center">
              <DemoBanner isDemo={isDemo} />
            </div>
          </Suspense>
        )}

        <header className="flex flex-col gap-2 border-b border-zinc-900 pb-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
                  Morning Brief
                </h1>
                {isDemo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    <FlaskConical className="h-3 w-3" />
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                Trackfluence Growth Architect — your ruthless but honest partner
                for creator-driven growth.
              </p>
            </div>
          </div>
        </header>

        <section>
          <MorningBrief 
            data={demoData?.morningBrief} 
            isDemo={isDemo}
          />
        </section>

        <section className="mt-4">
          <TriageFeed 
            items={demoData?.triageItems} 
            isDemo={isDemo}
          />
        </section>
      </div>
    </main>
  );
}
