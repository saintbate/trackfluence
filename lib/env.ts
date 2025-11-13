type ParsedEnv = {
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
  TIKTOK_APP_SECRET?: string;
  TIKTOK_API_BASE?: string;
  TIKTOK_REDIRECT_URL?: string;
  TIKTOK_BUSINESS_ACCOUNT_ID?: string;
};

const rawEnv: ParsedEnv = {
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
  TIKTOK_APP_SECRET: process.env.TIKTOK_APP_SECRET,
  TIKTOK_API_BASE: process.env.TIKTOK_API_BASE,
  TIKTOK_REDIRECT_URL: process.env.TIKTOK_REDIRECT_URL,
  TIKTOK_BUSINESS_ACCOUNT_ID: process.env.TIKTOK_BUSINESS_ACCOUNT_ID,
};

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
export const TIKTOK_BASE = (rawEnv.TIKTOK_API_BASE || "https://business-api.tiktok.com").trim();
export const TIKTOK_APP_ID = (rawEnv.TIKTOK_APP_ID || "").trim() || undefined;
export const TIKTOK_APP_SECRET = (rawEnv.TIKTOK_APP_SECRET || "").trim() || undefined;
export const TIKTOK_REDIRECT = (rawEnv.TIKTOK_REDIRECT_URL || "").trim() || undefined;
export const TIKTOK_DEFAULT_ACCOUNT_ID = (rawEnv.TIKTOK_BUSINESS_ACCOUNT_ID || "").trim() || undefined;


