import MorningBrief from "@/components/morning-brief";
import TriageFeed from "@/components/triage-feed";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-8">
        <header className="flex flex-col gap-2 border-b border-zinc-900 pb-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
                Morning Brief
              </h1>
              <p className="text-xs text-zinc-500">
                Trackfluence Growth Architect — your ruthless but honest partner
                for creator-driven growth.
              </p>
            </div>
          </div>
        </header>

        <section>
          <MorningBrief />
        </section>

        <section className="mt-4">
          <TriageFeed />
        </section>
      </div>
    </main>
  );
}
