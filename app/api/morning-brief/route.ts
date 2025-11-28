// app/api/morning-brief/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GROWTH_ARCHITECT_SYSTEM_PROMPT } from "@/lib/ai/growth-architect";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Set OPENAI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();

    // Expecting { messages: Array<{ role: string; content: string }> }
    const userMessages = Array.isArray(body?.messages) ? body.messages : [];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4.1-mini" depending on what you prefer
      messages: [
        {
          role: "system",
          content: GROWTH_ARCHITECT_SYSTEM_PROMPT,
        },
        ...userMessages,
      ],
      temperature: 0.4,
    });

    const message = completion.choices[0]?.message;

    return NextResponse.json(
      {
        message,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Failed to generate morning brief:", error);
  
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate morning brief";
  
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}