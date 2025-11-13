import { GA_ENABLED } from "@/lib/env";
export { GA_ENABLED } from "@/lib/env";
import type { EventKey, EventMap } from "@/lib/analytics/events";
import pkg from "@/package.json";

let lastKey = "";
let lastAt = 0;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getClientId(): string | undefined {
  if (!isBrowser()) return undefined;
  const cookiePairs = document.cookie.split("; ").filter(Boolean);
  const find = (name: string) =>
    cookiePairs.find((c) => c.startsWith(`${name}=`))?.split("=").slice(1).join("=");
  const cid = find("cid") || find("ga_cid");
  return cid ? decodeURIComponent(cid) : undefined;
}

function getBrandFromCookie(): { brand_id?: string; brand_name?: string } {
  if (!isBrowser()) return {};
  try {
    const cookiePairs = document.cookie.split("; ").filter(Boolean);
    const raw = cookiePairs.find((c) => c.startsWith("brand_ctx="))?.split("=").slice(1).join("=");
    if (!raw) return {};
    const obj = JSON.parse(decodeURIComponent(raw)) as { id?: string; name?: string } | null;
    return obj?.id ? { brand_id: obj.id, brand_name: obj.name ?? undefined } : {};
  } catch {
    return {};
  }
}

function getEnvTag(): "dev" | "prod" {
  const v = (process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development").toLowerCase();
  return v === "production" ? "prod" : "dev";
}

const APP_VERSION = (pkg as any)?.version || "0.0.0";

async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  try {
    const res = await fetch(input, init);
    return res;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ga] fetch failed");
    }
    return null;
  }
}

type GAParams = Record<string, string | number | boolean | null | undefined>;

export async function track<N extends EventKey>(name: N, params: EventMap[N]): Promise<void> {
  if (!GA_ENABLED) return;
  const client_id = getClientId();
  if (!client_id) return;

  // Auto-merge brand, env, app_version; add page path/title for page_view if absent
  const mergedBase: Record<string, any> = {
    ...(getBrandFromCookie()),
  };
  if (name === "page_view") {
    if (isBrowser()) {
      mergedBase.path = (params as any).path ?? window.location.pathname;
      mergedBase.title = (params as any).title ?? document.title;
    }
  }
  if (name === "brand_selected" || name === "theme_toggled") {
    mergedBase.env = getEnvTag();
    mergedBase.app_version = APP_VERSION;
  }

  const finalParams = { ...(params as any), ...mergedBase };

  const key = name + JSON.stringify(finalParams ?? {});
  const now = Date.now();
  if (key === lastKey && now - lastAt < 2000) return;
  lastKey = key;
  lastAt = now;

  const payload = {
    client_id,
    timestamp_micros: Date.now() * 1000,
    events: [
      {
        name,
        params: {
          engagement_time_msec: 1,
          anonymize_ip: true,
          non_personalized_ads: true,
          ...finalParams,
        },
      },
    ],
  };

  await safeFetch("/api/ga/collect", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}

export async function trackPageView(params: EventMap["page_view"]) {
  await track("page_view", params);
}

export async function trackEvent<N extends EventKey>(name: N, params: EventMap[N]) {
  await track(name, params);
}


