// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";

import ClientProviders from "@/components/ClientProviders";
import ThemeProvider from "@/components/layout/ThemeProvider";
import GAProvider from "@/components/analytics/GAProvider";
import { GA_ENABLED } from "@/lib/ga";

export const metadata: Metadata = {
  title: "Trackfluence",
  description: "Next-generation influencer marketing analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {GA_ENABLED ? (
            <Suspense fallback={null}>
              <GAProvider />
            </Suspense>
          ) : null}
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}