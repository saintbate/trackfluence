/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return new NextResponse("bad request", { status: 400 });
  const supa = getServiceClient();
  await (supa as any).from("webhook_events").insert({ source: "tiktok", payload: body });

  // TODO: parse event and call TikTok ingest server action for affected account/media
  return NextResponse.json({ ok: true });
}


