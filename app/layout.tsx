<<<<<<< HEAD
import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
=======
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ThemeProvider from "@/components/layout/ThemeProvider";
import GAProvider from "@/components/analytics/GAProvider";
import { GA_ENABLED } from "@/lib/ga";
>>>>>>> cursor/overview-wire

export const metadata: Metadata = {
  title: "Trackfluence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
=======
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          {GA_ENABLED ? <GAProvider /> : null}
        </ThemeProvider>
>>>>>>> cursor/overview-wire
      </body>
    </html>
  );
}