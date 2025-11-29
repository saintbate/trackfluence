import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Building2, Rocket, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing – Founding User Offer | 30% Off for Life",
  description:
    "Join the first 100 Trackfluence customers and lock in 30% off for life. Creator analytics, campaign ROAS, and revenue attribution for TikTok brands and agencies.",
  openGraph: {
    title: "Trackfluence Pricing – Founding User Offer | 30% Off for Life",
    description:
      "Join the first 100 Trackfluence customers and lock in 30% off for life. Creator analytics, campaign ROAS, and revenue attribution for TikTok brands and agencies.",
    url: "https://trackfluence.app/pricing",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackfluence Pricing – Founding User Offer | 30% Off for Life",
    description:
      "Join the first 100 Trackfluence customers and lock in 30% off for life. Creator analytics, campaign ROAS, and revenue attribution for TikTok brands and agencies.",
  },
};

// ============================================================================
// Plan Data
// ============================================================================

const plans = [
  {
    id: "creator",
    name: "Creator",
    icon: Sparkles,
    price: "$39",
    originalPrice: "$56",
    cadence: "per month",
    description: "For solo founders and small teams starting with creators.",
    badge: "Best for starting",
    highlight: false,
    ctaLabel: "Get Access",
    ctaHref: "https://app.trackfluence.app/login?offer=founding",
    disabled: false,
    features: [
      "1 TikTok ad account",
      "Up to 10 creators tracked",
      "Hourly performance sync",
      "Post-level analytics",
      "PDF report export",
      "7-day data retention",
      "Email support",
    ],
  },
  {
    id: "brand",
    name: "Brand",
    icon: Rocket,
    price: "$99",
    originalPrice: "$142",
    cadence: "per month",
    description: "For brands running multiple campaigns and creators.",
    badge: "Most popular",
    highlight: true,
    ctaLabel: "Start Brand Plan",
    ctaHref: "https://app.trackfluence.app/login?offer=founding",
    disabled: false,
    features: [
      "3 TikTok ad accounts",
      "Unlimited creators",
      "Full campaign analytics",
      "Weekly scheduled reports",
      "Client-ready templates",
      "90-day data retention",
      "Priority support",
      "Export to CSV",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    icon: Building2,
    price: "$199",
    originalPrice: "$285",
    cadence: "per month",
    description: "For agencies managing many brands and creator rosters.",
    badge: "Coming soon",
    highlight: false,
    ctaLabel: "Join Waitlist",
    ctaHref: "#agency-mode",
    disabled: true,
    features: [
      "10+ TikTok ad accounts",
      "Multi-brand workspaces",
      "Team roles & permissions",
      "Agency-branded reports",
      "Advanced client dashboards",
      "Unlimited data retention",
      "Dedicated support",
      "API access",
    ],
  },
];

// ============================================================================
// Comparison Data
// ============================================================================

const comparisonRows = [
  {
    label: "TikTok ad accounts",
    creator: "1",
    brand: "3",
    agency: "10+",
  },
  {
    label: "Creators tracked",
    creator: "Up to 10",
    brand: "Unlimited",
    agency: "Unlimited",
  },
  {
    label: "Campaign dashboards",
    creator: "Basic",
    brand: "Advanced",
    agency: "Advanced + custom",
  },
  {
    label: "Scheduled reports",
    creator: "Manual export",
    brand: "Weekly",
    agency: "Weekly + custom",
  },
  {
    label: "Data retention",
    creator: "7 days",
    brand: "90 days",
    agency: "Unlimited",
  },
  {
    label: "Multi-brand workspaces",
    creator: "—",
    brand: "—",
    agency: "✓",
  },
  {
    label: "Team roles & permissions",
    creator: "—",
    brand: "—",
    agency: "✓",
  },
];

// ============================================================================
// FAQ Data
// ============================================================================

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes. You can upgrade or downgrade at any time. Your Founding User discount still applies to your new plan.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "If you cancel, you keep access until the end of your billing period, but your Founding User discount is released. If you come back later, standard pricing applies.",
  },
  {
    question: "Do you offer trials or demos?",
    answer:
      "Yes. You can explore the product in demo mode and connect TikTok before committing. If you have a specific use case, reach out and we can walk through it together.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards via Stripe. All payments are secure and encrypted.",
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      {/* Page Header */}
      <section className="mb-10 space-y-4 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
          Pricing
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Choose the plan that matches your creator strategy
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
          Track every creator, prove every campaign, and send client-ready
          reports without spreadsheets.
        </p>
      </section>

      {/* Founding User Banner */}
      <section className="mb-10">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-base font-semibold text-emerald-300 sm:text-lg">
                <Zap className="h-4 w-4" />
                Founding User Offer — 30% Off for Life
              </h2>
              <p className="text-sm text-slate-300">
                Limited to the first 100 users. Your price will never increase
                as long as you stay subscribed.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Founding cohort: 100 spots
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Billing Toggle (placeholder for future) */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <button className="rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-medium text-sky-300">
            Monthly
          </button>
          <button
            className="cursor-not-allowed rounded-full px-4 py-1.5 text-xs font-medium text-slate-500"
            disabled
          >
            Annual{" "}
            <span className="text-[10px] opacity-60">(coming soon)</span>
          </button>
        </div>
      </div>

      {/* Plan Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
              plan.highlight
                ? "border-sky-500/40 bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent shadow-lg shadow-sky-500/10"
                : plan.disabled
                ? "border-white/5 bg-white/[0.02] opacity-80"
                : "border-white/10 bg-white/5"
            }`}
          >
            {/* Most Popular Badge */}
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 px-3 py-1 text-xs font-semibold text-black shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="space-y-3">
              {/* Badge Row */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    plan.disabled
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "border-white/15 bg-white/5 text-slate-400"
                  }`}
                >
                  {plan.badge}
                </span>
                {!plan.disabled && (
                  <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                    <span className="mr-1 inline-block h-1 w-1 rounded-full bg-emerald-400" />
                    Founding pricing
                  </span>
                )}
              </div>

              {/* Plan Name + Icon */}
              <div className="flex items-center gap-2">
                <plan.icon
                  className={`h-5 w-5 ${
                    plan.disabled ? "text-slate-500" : "text-sky-400"
                  }`}
                />
                <h3 className="text-lg font-semibold text-slate-50">
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold ${
                      plan.disabled ? "text-slate-400" : "text-slate-50"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.cadence}</span>
                  {!plan.disabled && (
                    <span className="text-sm text-slate-600 line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>
                {!plan.disabled && (
                  <p className="text-[11px] text-emerald-300/70">
                    Your Founding User price. Locked in for life.
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-400">{plan.description}</p>
            </div>

            {/* Features */}
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      plan.disabled ? "text-slate-600" : "text-emerald-400"
                    }`}
                  />
                  <span className={plan.disabled ? "text-slate-500" : ""}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-6 space-y-2">
              {plan.disabled ? (
                <a
                  href={plan.ctaHref}
                  className="block w-full rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-center text-sm font-medium text-amber-300 transition hover:bg-amber-500/20"
                >
                  {plan.ctaLabel}
                </a>
              ) : (
                <a
                  href={plan.ctaHref}
                  className={`block w-full rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                    plan.highlight
                      ? "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:from-sky-400 hover:via-cyan-300 hover:to-blue-400"
                      : "border border-white/20 bg-white/5 text-slate-100 hover:bg-white/10"
                  }`}
                >
                  {plan.ctaLabel}
                </a>
              )}
              {!plan.disabled && (
                <p className="text-center text-[11px] text-slate-500">
                  Founding User discount applied at checkout.
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Comparison Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-slate-100">
          Compare plans
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-medium">
            <div className="text-slate-400">Feature</div>
            <div className="text-center text-slate-400">Creator</div>
            <div className="text-center text-sky-300">Brand</div>
            <div className="text-center text-slate-500">Agency</div>
          </div>
          {/* Data Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 px-4 py-3 text-sm ${
                i !== comparisonRows.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="text-slate-300">{row.label}</div>
              <div className="text-center text-slate-400">{row.creator}</div>
              <div className="text-center text-slate-300">{row.brand}</div>
              <div className="text-center text-slate-500">{row.agency}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agency Mode Coming Soon */}
      <section id="agency-mode" className="mt-16 scroll-mt-20">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-amber-200">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                Agency mode · Coming Q1 2025
              </p>
              <h3 className="text-xl font-semibold text-slate-100 sm:text-2xl">
                Multi-brand workspaces for agencies
              </h3>
              <p className="max-w-xl text-sm text-slate-400">
                Manage multiple clients, assign team roles, and generate
                agency-branded reports — all from one dashboard. Join the
                waitlist to be first in line when Agency Mode launches.
              </p>
              <ul className="space-y-1.5 pt-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  Multi-client workspaces
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  Team roles & seat-based access
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  Client-ready reports on a schedule
                </li>
              </ul>
            </div>
            <div className="shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20"
              >
                Get notified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founding User Explainer */}
      <section className="mt-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">
            What does &quot;Founding User&quot; mean?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            As a Founding User, you&apos;re part of the first cohort of
            Trackfluence customers. In return for your early support, you get a
            lifetime discount and locked-in pricing.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              30% off your subscription for life
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Your rate never increases as long as you stay subscribed
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Free upgrade to Agency Mode when it launches
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Priority support and early feature access
            </li>
          </ul>
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-sm text-amber-200/80">
              Once the 100 Founding User spots are filled, this offer is gone
              for good.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <h3 className="font-medium text-slate-100">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-16 text-center">
        <p className="text-sm text-slate-500">
          Still have questions?{" "}
          <Link
            href="/about"
            className="font-medium text-sky-300 hover:text-sky-200"
          >
            Get in touch
          </Link>{" "}
          — we&apos;re happy to help.
        </p>
      </section>
    </main>
  );
}
