import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Trackfluence",
  description:
    "Learn how Trackfluence collects, uses, and protects data for brands, agencies, and users of the Trackfluence platform.",
  openGraph: {
    title: "Trackfluence Privacy Policy",
    description:
      "Learn how Trackfluence collects, uses, and protects data for brands, agencies, and users of the Trackfluence platform.",
    url: "https://trackfluence.app/privacy",
    siteName: "Trackfluence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackfluence Privacy Policy",
    description:
      "Learn how Trackfluence collects, uses, and protects data for brands, agencies, and users of the Trackfluence platform.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">
          This Privacy Policy explains how Trackfluence collects, uses, and
          protects information when you use our services.
        </p>
      </header>

      <section className="mt-8 space-y-4 text-sm text-slate-300">
        <p>
          Trackfluence is committed to handling data responsibly and in
          accordance with applicable privacy regulations. We collect and process
          data to provide and improve the Trackfluence platform for brands,
          agencies, and their teams.
        </p>
        <p>
          For detailed information about our data practices, or to request a
          copy of the latest version of our Privacy Policy, please contact the
          Trackfluence team.
        </p>
      </section>
    </main>
  );
}


