import { NextResponse } from "next/server";
import { z } from "zod";
import { DesignEditProviderError, editInfographic } from "@/app/lib/llm";
import { rateLimited } from "@/app/lib/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  prompt: z.string().trim().min(1).max(2200),
  design: z.object({
    name: z.string().max(120),
    width: z.number().min(200).max(4000),
    height: z.number().min(200).max(12000),
    background: z.string().max(40),
    objects: z.array(z.object({
      type: z.string().max(40),
      name: z.string().max(100),
      text: z.string().max(500),
      fill: z.string().max(40),
      fontSize: z.number().nullable(),
      fontFamily: z.string().max(60),
      fontWeight: z.union([z.string().max(20), z.number()]),
      fontStyle: z.string().max(20),
      underline: z.boolean(),
      linethrough: z.boolean(),
      textAlign: z.string().max(20),
      opacity: z.number().min(0).max(1),
      angle: z.number().finite(),
      left: z.number().finite(),
      top: z.number().finite(),
      width: z.number().finite().nonnegative(),
      height: z.number().finite().nonnegative(),
      locked: z.boolean(),
      selected: z.boolean(),
    }).strict()),
  }).strict(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(1000),
  }).strict()).max(8).optional().default([]),
}).strict();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid design and an edit request under 1000 characters." }, { status: 400 });
  }

  try {
    const result = await editInfographic(parsed.data.prompt, parsed.data.design, parsed.data.history);
    return NextResponse.json(result);
  } catch (error) {
    // console.error("[api/ai/edit] Request failed:", error);
    if (error instanceof DesignEditProviderError) {
      const headers = error.retryAfterSeconds
        ? { "Retry-After": String(Math.ceil(error.retryAfterSeconds)) }
        : undefined;
      return NextResponse.json({ error: error.message }, { status: 429, headers });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "The design assistant is temporarily unavailable." }, { status: 502 });
  }
}
