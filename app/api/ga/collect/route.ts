/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GA_API_SECRET, GA_MEASUREMENT_ID, GA_DEBUG } from "@/lib/env";

export const runtime = "edge";

type IncomingEvent = { name: string; params?: Record<string, any> };
type IncomingPayload = {
  client_id?: string;
  user_id?: string;
  timestamp_micros?: number;
  events: IncomingEvent[];
};

export async function POST(req: NextRequest) {
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    return NextResponse.json({ ok: false, error: "GA not configured" }, { status: 500 });
  }

  let body: IncomingPayload | null = null;
  try {
    body = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || (!body.client_id && !body.user_id) || !Array.isArray(body.events)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const endpoint = GA_DEBUG
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";

  const url = `${endpoint}?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(GA_API_SECRET)}`;
  const upstreamRes = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await upstreamRes.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {}

  return NextResponse.json({ ok: upstreamRes.ok, status: upstreamRes.status, data });
}


