import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTikTokDaily, getTikTokMedia } from "@/lib/tiktok";
import { upsertAccountDaily, upsertMediaRows } from "@/lib/tiktok/persist";
import { SOCIAL_DEBUG, TIKTOK_DEFAULT_ACCOUNT_ID } from "@/lib/env";

export const runtime = "edge";

const QuerySchema = z.object({
  brandId: z.string().uuid(),
  tiktokAccountId: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dryRun: z.union([z.literal("0"), z.literal("1")]).default("1"),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    brandId: url.searchParams.get("brandId"),
    tiktokAccountId: url.searchParams.get("tiktokAccountId") || TIKTOK_DEFAULT_ACCOUNT_ID,
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    dryRun: url.searchParams.get("dryRun") ?? "1",
  });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid query" }, { status: 400 });
  }
  const { brandId, tiktokAccountId, from, to, dryRun } = parsed.data;

  const [daily, media] = await Promise.all([
    getTikTokDaily({ brandId, accountId: tiktokAccountId, from, to }),
    getTikTokMedia({ brandId, accountId: tiktokAccountId, from, to }),
  ]);

  let savedDaily = 0;
  let savedMedia = 0;
  if (dryRun === "0") {
    savedDaily = await upsertAccountDaily(brandId, tiktokAccountId || TIKTOK_DEFAULT_ACCOUNT_ID || "", daily);
    savedMedia = await upsertMediaRows(brandId, tiktokAccountId || TIKTOK_DEFAULT_ACCOUNT_ID || "", media);
  }

  const body: Record<string, any> = {
    ok: true,
    daily: dryRun === "0" ? savedDaily : daily.length,
    media: dryRun === "0" ? savedMedia : media.length,
  };
  if (SOCIAL_DEBUG) {
    body.debug = { sampleDaily: daily.slice(0, 2), sampleMedia: media.slice(0, 2) };
  }
  return NextResponse.json(body, { status: 200 });
}


