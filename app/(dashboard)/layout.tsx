import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { BrandProvider } from "@/components/providers/BrandContext";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <BrandProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded bg-indigo-600 px-3 py-2 text-white">
          Skip to content
        </a>
        <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="container max-w-screen-2xl px-6 py-8">
              {children}
            </main>
          </div>
        </div>
      </BrandProvider>
    </Suspense>
  );
}


