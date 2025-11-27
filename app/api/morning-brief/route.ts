import { NextRequest } from "next/server";
import OpenAI from "openai";
import { StreamingTextResponse, OpenAIStream } from "ai";
import { GROWTH_ARCHITECT_SYSTEM_PROMPT } from "@/lib/ai/growth-architect";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { normalizedData } = body || {};

  const userContent =
    normalizedData != null
      ? `Here is the normalized performance data:\n\n${JSON.stringify(
          normalizedData,
          null,
          2,
        )}\n\nReturn 3–5 insights in the JSON format described.`
      : "No structured data was provided. Assume a small DTC brand testing 3 TikTok creators with mixed performance. Invent a realistic example and return 3–5 insights in the JSON format described.";

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: GROWTH_ARCHITECT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

