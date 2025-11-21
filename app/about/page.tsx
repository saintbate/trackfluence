import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – Why we built Trackfluence for TikTok creators",
  description:
    "Trackfluence exists to give TikTok-native brands and agencies the analytics they need to track every creator and prove every campaign.",
  openGraph: {
    title: "About Trackfluence – Built for TikTok-native brands and agencies",
    description:
      "Trackfluence exists to give TikTok-native brands and agencies the analytics they need to track every creator and prove every campaign.",
    url: "https://trackfluence.app/about",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Trackfluence – Built for TikTok-native brands and agencies",
    description:
      "Trackfluence exists to give TikTok-native brands and agencies the analytics they need to track every creator and prove every campaign.",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
          About
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for teams proving that creators drive the business.
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">
          Trackfluence started with a simple question: how do you prove that
          TikTok creators move revenue, not just views? We&apos;re building the
          analytics layer that answers that question for modern brands and
          agencies.
        </p>
      </header>

      <section className="mt-10 space-y-4 text-sm text-slate-300">
        <p>
          TikTok has changed how products are discovered and purchased. Creator
          campaigns now sit alongside paid social and search as core growth
          channels—but the analytics haven&apos;t kept up. Too many teams are
          still stitching together screenshots, links, and spreadsheets.
        </p>
        <p>
          Trackfluence exists so creator, marketing, and growth teams can speak
          the same language as finance and leadership. We focus on the metrics
          that matter: revenue, ROAS, CAC, and the creator performance signals
          behind them.
        </p>
        <p>
          We&apos;re building Trackfluence with a small group of TikTok-native
          brands and agencies who care deeply about proving the impact of their
          creator programs.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          Who Trackfluence is for
        </h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Brands that run always-on TikTok creator programs.</li>
          <li>Agencies that need to report creator performance to clients.</li>
          <li>
            Growth and marketing teams who want creator data alongside their
            other performance channels.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          Get in touch
        </h2>
        <p className="text-sm text-slate-300">
          If you&apos;re experimenting with TikTok creator campaigns and want a
          clearer view of performance, we&apos;d love to talk. Reach out to join
          the early Trackfluence partner group.
        </p>
      </section>
    </main>
  );
}


