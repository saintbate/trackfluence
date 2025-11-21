import type { Metadata } from "next";
import { CTAButton } from "@/components/marketing/CTAButton";

export const metadata: Metadata = {
  title: "Product – Creator performance analytics for TikTok campaigns",
  description:
    "See which TikTok creators and campaigns actually drive revenue with Trackfluence. Unified creator analytics, ROAS, CAC, and campaign performance in one dashboard.",
  openGraph: {
    title: "Trackfluence product – Creator performance analytics for TikTok campaigns",
    description:
      "See which TikTok creators and campaigns actually drive revenue with Trackfluence. Unified creator analytics, ROAS, CAC, and campaign performance in one dashboard.",
    url: "https://trackfluence.app/product",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackfluence product – Creator performance analytics for TikTok campaigns",
    description:
      "See which TikTok creators and campaigns actually drive revenue with Trackfluence. Unified creator analytics, ROAS, CAC, and campaign performance in one dashboard.",
  },
};

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
            Product
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            The creator analytics layer for TikTok-first teams.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Trackfluence connects your TikTok creator campaigns to revenue so
            you can see which creators to scale, which campaigns to retire, and
            how creator-led performance impacts your bottom line.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-slate-50">
              Creator & campaign source of truth
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Bring every creator, campaign, and piece of content into one
              place. No more screenshot folders or stitched-together
              spreadsheets.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-slate-50">
              Revenue, ROAS, and CAC in one view
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Understand the full impact of creator spend. Track revenue, ROAS,
              and CAC by creator, campaign, and cohort.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-slate-50">
              Ready-to-share insights
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Give marketing, growth, and finance a common language for
              creator-led performance with dashboards built for decision-making.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Key capabilities
          </h2>
          <dl className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <dt className="font-semibold text-slate-50">
                Creator performance breakdowns
              </dt>
              <dd className="mt-1">
                See performance by creator, cohort, and content format, with
                views, clicks, revenue, and ROAS in a single view.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <dt className="font-semibold text-slate-50">
                Campaign and flight reporting
              </dt>
              <dd className="mt-1">
                Understand how creator-led campaigns perform over time, broken
                down by creative, spend, and placement.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <dt className="font-semibold text-slate-50">
                Revenue and payback visibility
              </dt>
              <dd className="mt-1">
                See how quickly creator campaigns pay back spend and which
                creators consistently outperform your benchmarks.
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-black/70 p-6 shadow-2xl shadow-sky-900/50">
          <h2 className="text-sm font-semibold text-slate-50">
            Designed to feel like the product you log into every day.
          </h2>
          <p className="text-sm text-slate-300">
            The marketing site mirrors the Trackfluence dashboard so teams know
            exactly what they&apos;re getting: focused analytics that match
            what they use in production.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>Dark, TikTok-native aesthetic that matches the live app.</li>
            <li>Soft cards and gradient accents that reflect real dashboards.</li>
            <li>Creator metrics and charts tailored for TikTok campaigns.</li>
          </ul>
          <div className="pt-2">
            <CTAButton href="#get-access">Get Access</CTAButton>
          </div>
          <p className="text-[11px] text-slate-400">
            Already using Trackfluence?{" "}
            <a
              href="https://app.trackfluence.app/login"
              className="font-medium text-sky-300 hover:text-sky-200"
            >
              Log in to your dashboard
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}


