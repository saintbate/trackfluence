// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";

import ClientProviders from "@/components/ClientProviders";
import ThemeProvider from "@/components/layout/ThemeProvider";
import GAProvider from "@/components/analytics/GAProvider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { GA_ENABLED } from "@/lib/ga";

export const metadata: Metadata = {
  metadataBase: new URL("https://trackfluence.app"),
  title: {
    default: "Trackfluence – Influencer analytics for TikTok brands & agencies",
    template: "%s | Trackfluence",
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050509] text-slate-100 antialiased">
        <ThemeProvider>
          {GA_ENABLED ? (
            <Suspense fallback={null}>
              <GAProvider />
            </Suspense>
          ) : null}
          <ClientProviders>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-[#050509] to-black">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
