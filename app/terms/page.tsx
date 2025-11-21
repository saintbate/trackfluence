import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Trackfluence",
  description:
    "Read the Trackfluence Terms of Service for brands, agencies, and users of the Trackfluence platform.",
  openGraph: {
    title: "Trackfluence Terms of Service",
    description:
      "Read the Trackfluence Terms of Service for brands, agencies, and users of the Trackfluence platform.",
    url: "https://trackfluence.app/terms",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackfluence Terms of Service",
    description:
      "Read the Trackfluence Terms of Service for brands, agencies, and users of the Trackfluence platform.",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the Trackfluence platform.
        </p>
      </header>

      <section className="mt-8 space-y-4 text-sm text-slate-300">
        <p>
          The content on this page is provided for informational purposes. For
          the latest and legally binding version of our Terms of Service,
          please refer to the version shared with you during onboarding or
          contact Trackfluence directly.
        </p>
        <p>
          By using Trackfluence, you agree to comply with these Terms and any
          additional guidelines or policies we provide in connection with the
          services.
        </p>
      </section>
    </main>
  );
}


