/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies as getCookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { Database } from "@/lib/db.types"; // keep or adjust if your Database type lives elsewhere

type CookieStore = any;

type CreateServerClientOptions = {
  request?: NextRequest;
  response?: NextResponse;
};

export async function createServerClient(options: CreateServerClientOptions = {}) {
  const { request, response } = options;
  // In Next.js 15 / React 19, cookies() is async – await it before use to avoid
  // "cookies() should be awaited before using its value" dynamic API errors.
  const cookieStore: CookieStore = await (getCookies() as any);

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          // Prefer request header on middleware/auth callbacks
          if (request) {
            const raw = request.headers.get("cookie");
            if (!raw) return undefined;
            const hit = raw
              .split(";")
              .map((c) => c.trim())
              .find((c) => c.startsWith(`${name}=`));
            if (!hit) return undefined;
            return decodeURIComponent(hit.split("=").slice(1).join("="));
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions): void {
          if (response) {
            response.cookies.set(name, value, options);
          } else {
            cookieStore.set(name, value, options);
          }
        },
        remove(name: string, options?: CookieOptions): void {
          // Avoid spreading undefined
          const opts = options ? { ...options, maxAge: 0 } : { maxAge: 0 };
          if (response) {
            response.cookies.set(name, "", opts);
          } else {
            cookieStore.set(name, "", opts);
          }
        },
      },
    }
  );
}