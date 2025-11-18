// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { APP_URL } from "@/lib/env";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_URL = APP_URL || "https://app.trackfluence.app";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/overview";

  const redirectUrl = new URL(next, SITE_URL);
  const res = NextResponse.redirect(redirectUrl);

  if (!code) {
    const fail = new URL(`/signin?error=${encodeURIComponent("missing oauth code")}`, SITE_URL);
    return NextResponse.redirect(fail);
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        const raw = req.headers.get("cookie") || "";
        const hit = raw
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith(`${name}=`));
        return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : undefined;
      },
      set(name, value, options) {
        res.cookies.set(name, value, options);
      },
      remove(name, options) {
        res.cookies.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const fail = new URL(`/signin?error=${encodeURIComponent(error.message)}`, SITE_URL);
    return NextResponse.redirect(fail);
  }

  return res;
}