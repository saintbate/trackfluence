import type { Metadata } from "next";
import { CTAButton } from "@/components/marketing/CTAButton";

export const metadata: Metadata = {
  title: "How it works – Track every creator, prove every TikTok campaign",
  description:
    "Trackfluence connects your TikTok creator campaigns to revenue. Ingest creator data, attribute performance, and share dashboards that prove every campaign.",
  openGraph: {
    title: "How Trackfluence works – Track every creator, prove every TikTok campaign",
    description:
      "Trackfluence connects your TikTok creator campaigns to revenue. Ingest creator data, attribute performance, and share dashboards that prove every campaign.",
    url: "https://trackfluence.app/how-it-works",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "How Trackfluence works – Track every creator, prove every TikTok campaign",
    description:
      "Trackfluence connects your TikTok creator campaigns to revenue. Ingest creator data, attribute performance, and share dashboards that prove every campaign.",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
            How it works
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            From TikTok posts to campaign-level revenue in three steps.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Trackfluence plugs into your existing creator workflows so you can
            see which TikToks drive revenue, which creators to scale, and how
            creator budgets perform over time.
          </p>
        </div>

        <ol className="grid gap-5 md:grid-cols-3 text-sm text-slate-300">
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
              Step 1
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-50">
              Connect creators & campaigns
            </h2>
            <p className="mt-2">
              Import your TikTok creators, campaigns, and content into
              Trackfluence so every post and spend line is tracked from day one.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
              Step 2
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-50">
              Attribute performance to revenue
            </h2>
            <p className="mt-2">
              Map creator activity to on-site behavior and revenue so you can
              clearly see which creators and campaigns move the needle.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
              Step 3
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-50">
              Share-ready reporting
            </h2>
            <p className="mt-2">
              Give marketing, growth, and finance dashboards they can trust to
              plan, defend, and scale creator budgets.
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            A workflow built for TikTok-native teams.
          </h2>
          <p className="max-w-2xl text-sm text-slate-300">
            Trackfluence is opinionated about what matters for creator
            campaigns: revenue, payback, and creator performance. We handle the
            analytics plumbing so your team can focus on creative and strategy.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Onboard a focused set of creators and campaigns quickly.</li>
            <li>Layer in your existing tracking and attribution setup.</li>
            <li>
              Ship dashboards that leadership understands in the first meeting.
            </li>
          </ul>
          <CTAButton href="/pricing">Talk to the team</CTAButton>
          <p className="mt-2 text-[11px] text-emerald-300/70">
            Founding User cohort now open — 30% off for life for the first 100 users.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-black/70 p-6 shadow-2xl shadow-sky-900/50">
          <h2 className="text-sm font-semibold text-slate-50">
            What you see in the dashboard.
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Creator- and campaign-level revenue views.</li>
            <li>ROAS and CAC trends over time.</li>
            <li>Top creators and content ranked by business impact.</li>
            <li>Filters for brand, date range, and campaign groupings.</li>
          </ul>
          <p className="text-[11px] text-slate-400">
            To see the full experience, existing customers can{" "}
            <a
              href="https://app.trackfluence.app/login"
              className="font-medium text-sky-300 hover:text-sky-200"
            >
              log in to Trackfluence
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}


