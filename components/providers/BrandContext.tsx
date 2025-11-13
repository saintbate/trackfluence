"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

type BrandCtx = {
  brandId?: string;
  brandName?: string;
};

type BrandContextValue = BrandCtx & {
  setBrand: (next: { brandId: string; brandName: string }) => void;
};

const Ctx = React.createContext<BrandContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ").filter(Boolean);
  const entry = parts.find((c) => c.startsWith(`${name}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.split("=").slice(1).join("="));
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure`;
}

function parseBrandCookie(): BrandCtx {
  try {
    const raw = readCookie("brand_ctx");
    if (!raw) return {};
    const obj = JSON.parse(raw) as { id?: string; name?: string } | null;
    return obj?.id ? { brandId: obj.id, brandName: obj.name } : {};
  } catch {
    return {};
  }
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = React.useState<BrandCtx>(() => {
    const fromUrlId = searchParams?.get("brandId") ?? undefined;
    const fromUrlName = searchParams?.get("brandName") ?? undefined;
    if (fromUrlId) return { brandId: fromUrlId, brandName: fromUrlName ?? undefined };
    const fromCookie = parseBrandCookie();
    return fromCookie;
  });

  React.useEffect(() => {
    const id = searchParams?.get("brandId") ?? undefined;
    const name = searchParams?.get("brandName") ?? undefined;
    if (id) {
      setState({ brandId: id, brandName: name ?? state.brandName });
      writeCookie("brand_ctx", JSON.stringify({ id, name: name ?? state.brandName ?? "" }), 60 * 60 * 24 * 730);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const setBrand = React.useCallback((next: { brandId: string; brandName: string }) => {
    setState({ brandId: next.brandId, brandName: next.brandName });
    writeCookie("brand_ctx", JSON.stringify({ id: next.brandId, name: next.brandName }), 60 * 60 * 24 * 730);
  }, []);

  const value = React.useMemo<BrandContextValue>(() => ({ ...state, setBrand }), [setBrand, state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrand(): { brandId?: string; brandName?: string } {
  const ctx = React.useContext(Ctx);
  return ctx ? { brandId: ctx.brandId, brandName: ctx.brandName } : {};
}

export function useSetBrand(): (next: { brandId: string; brandName: string }) => void {
  const ctx = React.useContext(Ctx);
  return ctx?.setBrand ?? (() => {});
}


