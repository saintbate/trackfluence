/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ENABLED, track } from "@/lib/ga";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function GAProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build page location and title
  const page_location = useMemo(() => {
    if (typeof window === "undefined") return "";
    const qs = searchParams?.toString() || "";
    return `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
  }, [pathname, searchParams]);

  const page_title = useMemo(() => {
    if (typeof document === "undefined") return "";
    const el = document.querySelector<HTMLElement>("[data-page-title]");
    return el?.textContent || document.title || "";
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!GA_ENABLED) return;
    track("page_view", { path: pathname, title: page_title });
  }, [page_location, page_title]);

  if (!GA_ENABLED) return null;
  return null;
}


