type ParsedEnv = {
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_MARKETING_URL?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  GA4_API_SECRET?: string;
  NEXT_PUBLIC_GA_DEBUG?: string;
  NEXT_PUBLIC_IG_ENABLED?: string;
  NEXT_PUBLIC_SOCIAL_DEBUG?: string;
  SOCIAL_MOCK_DATA?: string;
  META_APP_ID?: string;
  META_APP_SECRET?: string;
  META_GRAPH_API_BASE?: string;
  IG_SYSTEM_USER_TOKEN?: string;
  IG_BUSINESS_ACCOUNT_ID?: string;
  NEXT_PUBLIC_TIKTOK_ENABLED?: string;
  TIKTOK_APP_ID?: string;
  TIKTOK_CLIENT_SECRET?: string;
  TIKTOK_BASE?: string;
  TIKTOK_REDIRECT?: string;
  TIKTOK_BUSINESS_ACCOUNT_ID?: string;
};

const rawEnv: ParsedEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  GA4_API_SECRET: process.env.GA4_API_SECRET,
  NEXT_PUBLIC_GA_DEBUG: process.env.NEXT_PUBLIC_GA_DEBUG,
  NEXT_PUBLIC_IG_ENABLED: process.env.NEXT_PUBLIC_IG_ENABLED,
  NEXT_PUBLIC_SOCIAL_DEBUG: process.env.NEXT_PUBLIC_SOCIAL_DEBUG,
  SOCIAL_MOCK_DATA: process.env.SOCIAL_MOCK_DATA,
  META_APP_ID: process.env.META_APP_ID,
  META_APP_SECRET: process.env.META_APP_SECRET,
  META_GRAPH_API_BASE: process.env.META_GRAPH_API_BASE,
  IG_SYSTEM_USER_TOKEN: process.env.IG_SYSTEM_USER_TOKEN,
  IG_BUSINESS_ACCOUNT_ID: process.env.IG_BUSINESS_ACCOUNT_ID,
  NEXT_PUBLIC_TIKTOK_ENABLED: process.env.NEXT_PUBLIC_TIKTOK_ENABLED,
  TIKTOK_APP_ID: process.env.TIKTOK_APP_ID,
  TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
  TIKTOK_BASE: process.env.TIKTOK_BASE,
  TIKTOK_REDIRECT: process.env.TIKTOK_REDIRECT,
  TIKTOK_BUSINESS_ACCOUNT_ID: process.env.TIKTOK_BUSINESS_ACCOUNT_ID,
};

export const APP_URL = (rawEnv.NEXT_PUBLIC_APP_URL || "").trim() || undefined;
export const MARKETING_URL = (rawEnv.NEXT_PUBLIC_MARKETING_URL || "").trim() || undefined;

export const GA_MEASUREMENT_ID = (rawEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim() || undefined;
export const GA_API_SECRET = (rawEnv.GA4_API_SECRET || "").trim() || undefined;
export const GA_DEBUG = rawEnv.NEXT_PUBLIC_GA_DEBUG === "1";
export const GA_ENABLED = Boolean(GA_MEASUREMENT_ID);

export const IG_ENABLED = (rawEnv.NEXT_PUBLIC_IG_ENABLED || "false").toLowerCase() === "true";
export const SOCIAL_DEBUG = (rawEnv.NEXT_PUBLIC_SOCIAL_DEBUG || "0") === "1";
export const SOCIAL_MOCK = (rawEnv.SOCIAL_MOCK_DATA || "0") === "1";
export const META_BASE = (rawEnv.META_GRAPH_API_BASE || "https://graph.facebook.com/v18.0").trim();
export const META_APP_ID = (rawEnv.META_APP_ID || "").trim() || undefined;
export const META_APP_SECRET = (rawEnv.META_APP_SECRET || "").trim() || undefined;
export const IG_SYSTEM_TOKEN = (rawEnv.IG_SYSTEM_USER_TOKEN || "").trim() || undefined;
export const IG_DEFAULT_BUSINESS_ID = (rawEnv.IG_BUSINESS_ACCOUNT_ID || "").trim() || undefined;

export function envOrNull(key: keyof ParsedEnv): string | null {
  const v = rawEnv[key];
  return v && v.trim() ? v.trim() : null;
}

export const TIKTOK_ENABLED = (rawEnv.NEXT_PUBLIC_TIKTOK_ENABLED || "false").toLowerCase() === "true";

type TikTokConfig = {
  appId: string;
  clientSecret: string;
  redirect: string;
  base: string;
  defaultAccountId?: string;
};

function parseTikTokConfig(): TikTokConfig | null {
  const isBrowser = typeof window !== "undefined";
  const missing: string[] = [];

  const appId = (rawEnv.TIKTOK_APP_ID || "").trim();
  if (!appId) missing.push("TIKTOK_APP_ID");

  const clientSecret = (rawEnv.TIKTOK_CLIENT_SECRET || "").trim();
  if (!clientSecret) missing.push("TIKTOK_CLIENT_SECRET");

  const redirect = (rawEnv.TIKTOK_REDIRECT || "").trim();
  if (!redirect) missing.push("TIKTOK_REDIRECT");

  const base = (rawEnv.TIKTOK_BASE || "https://business-api.tiktok.com").trim();

  if (missing.length > 0) {
    // On the server, fail fast with a descriptive error so misconfigurations
    // surface clearly during OAuth/init. In the browser bundle, avoid throwing
    // at module evaluation time (env.ts is imported by client code such as GA).
    if (!isBrowser) {
      throw new Error(
        `[env] Missing required TikTok OAuth env vars: ${missing.join(
          ", "
        )}. Please set them in your environment (e.g. .env.local or Vercel project settings).`
      );
    }
    return null;
  }

  const defaultAccountId = (rawEnv.TIKTOK_BUSINESS_ACCOUNT_ID || "").trim() || undefined;

  return {
    appId,
    clientSecret,
    redirect,
    base,
    defaultAccountId,
  };
}

const TIKTOK_CONFIG = parseTikTokConfig();

export const TIKTOK_APP_ID = TIKTOK_CONFIG?.appId;
export const TIKTOK_CLIENT_SECRET = TIKTOK_CONFIG?.clientSecret;
export const TIKTOK_REDIRECT = TIKTOK_CONFIG?.redirect;
export const TIKTOK_BASE = TIKTOK_CONFIG?.base ?? "https://business-api.tiktok.com";
export const TIKTOK_DEFAULT_ACCOUNT_ID = TIKTOK_CONFIG?.defaultAccountId;


