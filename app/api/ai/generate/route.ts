// import { NextResponse } from "next/server";
// import { generateInfographic } from "@/app/lib/llm";
// import { cacheGet, cacheSet, hashText, rateLimited } from "@/app/lib/cache";

// export const runtime = "nodejs";
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
//   if (rateLimited(ip)) return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });

//   const body = await req.json().catch(() => null);
//   const text: string = (body?.text ?? "").toString().trim();
//   if (text.length < 40) return NextResponse.json({ error: "Please enter at least a couple of sentences." }, { status: 400 });

//   const input = text.slice(0, 6000);
//   const key = hashText(input);
//   const cached = cacheGet(key);
//   if (cached) return NextResponse.json({ ...(cached as object), cached: true });

//   const result = await generateInfographic(input);
//   if (result.source !== "fallback") cacheSet(key, result);
//   return NextResponse.json(result);
// }

import { NextResponse } from "next/server";
import { generateInfographic } from "@/app/lib/llm";
import { cacheGet, cacheSet, hashText, rateLimited } from "@/app/lib/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const text: string = (body?.text ?? "").toString().trim();
  if (text.length < 3) return NextResponse.json({ error: "Please enter a topic or prompt." }, { status: 400 });

  const input = text.slice(0, 6000);
  const key = hashText(input);
  const cached = cacheGet(key);
  if (cached) return NextResponse.json({ ...(cached as object), cached: true });

  const result = await generateInfographic(input);
  if (result.source !== "fallback") cacheSet(key, result);
  return NextResponse.json(result);
}