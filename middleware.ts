// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Base response
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Simple GA `cid` cookie handling (Edge-safe, no Node APIs)
  try {
    const cidCookie = req.cookies.get("cid")?.value;
    const legacyCid = req.cookies.get("ga_cid")?.value;
    const currentCid = cidCookie ?? legacyCid;

    if (!currentCid) {
      // Use web crypto on Edge instead of Node's crypto
      const v =
        globalThis.crypto?.randomUUID?.() ??
        Math.random().toString(36).slice(2);

      res.cookies.set("cid", v, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
        sameSite: "lax",
      });
    } else if (!cidCookie && currentCid) {
      // backfill cid from legacy ga_cid
      res.cookies.set("cid", currentCid, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2,
        sameSite: "lax",
      });
    }
  } catch (err) {
    console.error("Error setting cid cookie in middleware:", err);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};