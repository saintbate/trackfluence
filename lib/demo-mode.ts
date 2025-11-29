// lib/demo-mode.ts

/**
 * Demo Mode utilities for Trackfluence
 * Allows new users to explore the Growth Architect dashboards with realistic fake data
 * without needing to connect TikTok or have real Supabase data.
 */

type SearchParamsLike =
  | URLSearchParams
  | { [key: string]: string | string[] | undefined }
  | null
  | undefined;

/**
 * Checks if demo mode is active based on search params.
 * Returns true if `demo` is "1" or "true" (case-insensitive).
 */
export function isDemoSearchParam(searchParams: SearchParamsLike): boolean {
  if (!searchParams) return false;

  let demoValue: string | string[] | undefined | null;

  if (searchParams instanceof URLSearchParams) {
    demoValue = searchParams.get("demo");
  } else {
    demoValue = searchParams.demo;
  }

  // Handle array case (Next.js can pass arrays for repeated params)
  if (Array.isArray(demoValue)) {
    demoValue = demoValue[0];
  }

  if (!demoValue) return false;

  const normalized = demoValue.toLowerCase().trim();
  return normalized === "1" || normalized === "true";
}

/**
 * Appends the demo param to a URL if demo mode is active.
 * If `isDemo` is false, returns the URL unchanged.
 * If `isDemo` is true and URL does not already contain `demo=`, appends `?demo=1` or `&demo=1`.
 */
export function appendDemoParam(url: string, isDemo: boolean): string {
  if (!isDemo) return url;

  // Check if URL already has demo param
  if (/[?&]demo=/i.test(url)) return url;

  // Determine if we need ? or &
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}demo=1`;
}

/**
 * Removes the demo param from a URL.
 * Used for "Exit Demo" functionality.
 */
export function removeDemoParam(url: string): string {
  // Remove demo=1 or demo=true (with ? or &)
  let result = url.replace(/[?&]demo=(1|true)/gi, "");
  
  // Clean up any trailing ? or && artifacts
  result = result.replace(/\?&/, "?");
  result = result.replace(/&&/, "&");
  result = result.replace(/\?$/, "");
  result = result.replace(/&$/, "");
  
  return result;
}

/**
 * Build a URL with demo param preserved from current params.
 * Useful for navigation links.
 */
export function buildDemoAwareUrl(
  baseUrl: string,
  currentSearchParams: SearchParamsLike,
  additionalParams?: Record<string, string>
): string {
  const isDemo = isDemoSearchParam(currentSearchParams);
  
  // Start with base URL
  const url = new URL(baseUrl, "http://localhost");
  
  // Add additional params if provided
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  // Add demo param if in demo mode
  if (isDemo) {
    url.searchParams.set("demo", "1");
  }
  
  // Return just the path + search
  return `${url.pathname}${url.search}`;
}
