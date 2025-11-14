// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // Use a mutable response object so cookies & headers are attached correctly
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // --- GA / cid cookie handling -------------------------------------------
  const currentCid =
    req.cookies.get("cid")?.value ?? req.cookies.get("ga_cid")?.value;

  if (!currentCid) {
    const v = crypto.randomUUID();
    res.cookies.set("cid", v, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
  } else if (!req.cookies.get("cid")?.value && currentCid) {
    // Backfill `cid` from legacy `ga_cid`
    res.cookies.set("cid", currentCid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
  }

  // --- Supabase client (Edge-safe) ----------------------------------------
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing in production, don't crash middleware
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase env vars missing in middleware. Check Vercel env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return res;
  }

  type CookieOptions = Parameters<typeof res.cookies.set>[2];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        res.cookies.set(name, value, options);
      },
      remove(name: string, options?: CookieOptions) {
        res.cookies.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase auth.getUser error in middleware:", error.message);
    // Fail open: let the request through instead of hard-crashing
    return res;
  }

  const user = data.user;

  // --- Route protection logic ---------------------------------------------
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/signin") ||
    req.nextUrl.pathname.startsWith("/auth/callback") ||
    req.nextUrl.pathname.startsWith("/whoami") ||
    req.nextUrl.pathname.startsWith("/brand-debug");

  if (!user && !isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set(
      "redirectTo",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  if (user && req.nextUrl.pathname === "/signin") {
    const url = req.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};