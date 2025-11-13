// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ThemeProvider from "@/components/layout/ThemeProvider";
import GAProvider from "@/components/analytics/GAProvider";
import { GA_ENABLED } from "@/lib/ga";

export const metadata: Metadata = {
  title: "Trackfluence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          {GA_ENABLED ? <GAProvider /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}