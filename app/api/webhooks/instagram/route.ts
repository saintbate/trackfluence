/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return new NextResponse("bad request", { status: 400 });

  const supa = getServiceClient();
  await (supa as any).from("webhook_events").insert({ source: "instagram", payload: body });

  // TODO: schedule refresh via existing server actions (e.g., refreshInstagram) based on event contents
  return NextResponse.json({ ok: true });
}

// Instagram verification (Graph API subscriptions)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WEBHOOK_SHARED_SECRET) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}


