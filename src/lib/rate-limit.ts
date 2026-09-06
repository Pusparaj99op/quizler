import { headers } from 'next/headers';

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * In-memory sliding-window limiter. Vercel Fluid Compute reuses warm instances,
 * so this catches real brute-force bursts even though it isn't shared across
 * instances/regions — good enough for this app's scale without adding a Redis
 * dependency. Swap for an Upstash-backed limiter if abuse ever needs cross-instance
 * accuracy.
 */
const buckets = new Map<string, Bucket>();

// Periodically forget stale entries so `buckets` doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/**
 * Returns true if the action for `key` is allowed, consuming one attempt.
 * `limit` attempts are allowed per `windowMs`.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
