import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/marketing/CTAButton";

export const metadata: Metadata = {
  title: "Trackfluence – Influencer analytics for TikTok brands & agencies",
  description:
    "Trackfluence is the all-in-one influencer analytics platform to track every creator, prove every campaign, and understand creator-led performance across TikTok.",
  openGraph: {
    title: "Trackfluence – Influencer analytics for TikTok brands & agencies",
    description:
      "Trackfluence is the all-in-one influencer analytics platform to track every creator, prove every campaign, and understand creator-led performance across TikTok.",
    url: "https://trackfluence.app",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackfluence – Influencer analytics for TikTok brands & agencies",
    description:
      "Trackfluence is the all-in-one influencer analytics platform to track every creator, prove every campaign, and understand creator-led performance across TikTok.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Trackfluence",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Trackfluence is the all-in-one influencer analytics platform to track every creator, prove every campaign, and understand creator-led performance across TikTok.",
  url: "https://trackfluence.app",
  publisher: {
    "@type": "Organization",
    name: "Trackfluence",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
        {/* Hero */}
        <section
          id="get-access"
          className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/5 px-3 py-1 text-xs font-medium text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.45)]">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>Influencer analytics for TikTok-native brands and agencies</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Track every creator.
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Prove every campaign.
                </span>
              </h1>
              <p className="max-w-xl text-balance text-sm text-slate-300 sm:text-base">
                Trackfluence is the creator analytics layer for TikTok-first brands
                and agencies. See which creators drive revenue, understand
                creator-led performance, and defend every dollar you spend.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Unified revenue, ROAS, and CAC across all creator campaigns.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>True creator performance insights, not vanity metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Built for TikTok-native teams that need answers, fast.</span>
              </li>
            </ul>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <CTAButton href="#get-access">Get Access</CTAButton>
                <CTAButton href="https://app.trackfluence.app/login" variant="secondary">
                  Go to Dashboard
                </CTAButton>
              </div>
              <p className="text-xs text-slate-400">
                Already a customer?{" "}
                <a
                  href="https://app.trackfluence.app/login"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Log in to your Trackfluence dashboard.
                </a>
              </p>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_100%_0,rgba(129,140,248,0.2),transparent_55%)]" />
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 via-white/3 to-black/40 p-4 shadow-2xl shadow-sky-900/70 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Creator performance snapshot
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Blended view across TikTok creator campaigns.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-300">
                  Live dashboards
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Total revenue
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    $482k
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-300">
                    ↑ 38% vs last 30 days
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    ROAS
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    4.6x
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Creator-led vs paid amplification.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Active creators
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    143
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Across 12 live campaigns.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-200">
                    Revenue over time
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Last 30 days · USD
                  </p>
                </div>
                <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-black">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.3),transparent_55%),radial-gradient(circle_at_100%_0,rgba(129,140,248,0.25),transparent_55%)] opacity-70" />
                  <div className="relative flex h-full items-end gap-1.5 px-3 pb-3">
                    {Array.from({ length: 24 }).map((_, idx) => (
                      <div
                        // Static, purely decorative sparkline; using the index as a key is acceptable here because the chart is static.
                        key={idx}
                        className="flex-1 rounded-full bg-gradient-to-t from-sky-500/40 via-cyan-400/70 to-sky-200"
                        style={{ height: `${30 + ((idx * 7) % 55)}%` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Visuals inspired by the live Trackfluence dashboard at{" "}
                  <Link
                    href="https://app.trackfluence.app/login"
                    className="underline underline-offset-2"
                  >
                    app.trackfluence.app
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works summary */}
        <section className="mt-20 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Built for TikTok-first creator campaigns.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300">
              Trackfluence plugs into your existing creator workflows to help you
              understand which TikToks drive revenue, which creators should be
              scaled, and which campaigns to retire.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                Connect creators & campaigns
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Centralize creators, campaigns, and spend across TikTok to build a
                single view of creator performance.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                Attribute revenue, not likes
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Move beyond vanity metrics with clear attribution that shows
                which creators actually drive revenue.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-slate-50">
                Defend every creator dollar
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Share-ready insights and dashboards your team can use to justify
                creator budgets with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="mt-24 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Simple, usage-based pricing.
            </h2>
            <p className="text-sm text-slate-300">
              Start with a small creator roster. Scale pricing as campaigns grow.
            </p>
          </div>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-black/70 p-6 shadow-2xl shadow-sky-900/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-50">
                  Contact us for early access pricing
                </p>
                <p className="text-sm text-slate-300">
                  We&apos;re working closely with a small group of TikTok-native
                  brands and agencies.
                </p>
              </div>
              <CTAButton href="#get-access">Request Access</CTAButton>
            </div>
            <ul className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Creator- and campaign-based pricing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Unlimited read-only seats for leadership and finance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Hands-on onboarding with creator analytics specialists.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
