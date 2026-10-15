import { createHash } from "crypto";

// In-memory LRU cache + per-IP rate limit. Works on a single Node instance;
// swap for Upstash Redis (free tier) if you deploy on serverless.
const cache = new Map<string, unknown>();
const MAX = 200;

export const hashText = (t: string) => createHash("sha256").update(t.trim().toLowerCase()).digest("hex");
export function cacheGet<T>(k: string): T | undefined {
  const v = cache.get(k) as T | undefined;
  if (v !== undefined) { cache.delete(k); cache.set(k, v); }
  return v;
}
export function cacheSet(k: string, v: unknown) {
  cache.set(k, v);
  if (cache.size > MAX) cache.delete(cache.keys().next().value!);
}

const hits = new Map<string, number[]>();
export function rateLimited(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}