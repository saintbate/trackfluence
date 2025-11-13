// middleware.ts
<<<<<<< HEAD
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/((?!signin|api/auth|_next|favicon.ico).*)"],
=======
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Ensure anonymous GA client id cookie exists (first-party)
  const cid = req.cookies.get("cid")?.value || req.cookies.get("ga_cid")?.value;
  if (!cid) {
    const v = crypto.randomUUID();
    res.cookies.set("cid", v, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
  } else if (!req.cookies.get("cid")?.value && cid) {
    // Backfill `cid` from legacy `ga_cid`
    res.cookies.set("cid", cid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
  }
  type CookieOptions = Parameters<typeof res.cookies.set>[2];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/signin") ||
    req.nextUrl.pathname.startsWith("/auth/callback") ||
    req.nextUrl.pathname.startsWith("/whoami") ||
    req.nextUrl.pathname.startsWith("/brand-debug");

  if (!user && !isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirectTo", req.nextUrl.pathname + req.nextUrl.search);
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
>>>>>>> cursor/overview-wire
};