import { and, eq, lt, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import { getDb, schema } from "lib/db";

const { rateLimitCounters } = schema;

/** How long a bucket lasts, and how many submissions it permits. */
export const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
export const RATE_LIMIT_MAX_HITS = 5;

/** Buckets older than this can only ever be stale, so they are swept up. */
const RATE_LIMIT_PRUNE_AFTER_MS = 24 * 60 * 60_000;

export type RateLimitDecision = {
  allowed: boolean;
  hits: number;
  limit: number;
};

/** The start of the fixed window that `now` falls inside. */
export function rateLimitWindowStart(
  now: Date,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

/**
 * The bucket name for one caller on one route.
 *
 * Hashed rather than stored raw: an IP address is personal data, and the limiter
 * only needs a stable bucket, not the address itself.
 */
export function rateLimitKey(route: string, identifier: string): string {
  const digest = createHash("sha256")
    .update(identifier)
    .digest("hex")
    .slice(0, 32);

  return `${route}:${digest}`;
}

/**
 * The caller's identifier, from the headers the platform sets.
 *
 * `x-real-ip` is preferred: the platform sets it from the connection itself, so a client
 * cannot forge it. `x-forwarded-for` is a list that may carry values the client supplied,
 * so it is only a fallback for local runs — and when it is used, its first entry stands in
 * for the caller.
 *
 * Getting this precedence wrong makes the limiter silently bypassable: rotate the value and
 * every request gets a fresh bucket, while the logs still look like rate limiting is
 * happening. Hence a pure function and a test, rather than inline header reading.
 */
export function clientIdentifierFromHeaders(headers: {
  realIp?: string | null;
  forwardedFor?: string | null;
}): string {
  const realIp = headers.realIp?.trim();

  if (realIp) {
    return realIp;
  }

  const firstForwarded = headers.forwardedFor?.split(",")[0]?.trim();

  if (firstForwarded) {
    return firstForwarded;
  }

  // One shared bucket for callers we cannot identify, which is over-strict rather than
  // unlimited.
  return "unknown";
}

/** `clientIdentifierFromHeaders` applied to a live request. */
export function clientIdentifier(request: Request): string {
  return clientIdentifierFromHeaders({
    realIp: request.headers.get("x-real-ip"),
    forwardedFor: request.headers.get("x-forwarded-for"),
  });
}

/**
 * Counts this hit and reports whether it is allowed.
 *
 * Fixed window. The count is bumped with a single atomic `hits = hits + 1`, so two
 * simultaneous submissions cannot both read a stale value and both be let through.
 * Starting a new window is a separate typed comparison against the stored start,
 * which keeps dates out of raw SQL.
 *
 * **Fails open.** If the limiter itself is broken the submission is allowed: a
 * limiter outage must not close the only way a customer can reach us. The failure
 * is logged, so failing open cannot also be silent.
 */
export async function checkContactRateLimit(
  identifier: string,
): Promise<RateLimitDecision> {
  const key = rateLimitKey("contact/submit", identifier);
  const now = new Date();
  const windowStart = rateLimitWindowStart(now);

  try {
    const db = getDb();

    // 1. Make sure the bucket exists. `do nothing`, because a concurrent insert of
    //    the same key is a fine outcome rather than an error.
    await db
      .insert(rateLimitCounters)
      .values({ key, windowStartedAt: windowStart, hits: 0 })
      .onConflictDoNothing();

    // 2. A stored window older than the current one means this is the first hit of
    //    a new window, so it starts over.
    await db
      .update(rateLimitCounters)
      .set({ windowStartedAt: windowStart, hits: 0 })
      .where(
        and(
          eq(rateLimitCounters.key, key),
          lt(rateLimitCounters.windowStartedAt, windowStart),
        ),
      );

    // 3. Count this hit.
    const [row] = await db
      .update(rateLimitCounters)
      .set({ hits: sql`${rateLimitCounters.hits} + 1` })
      .where(eq(rateLimitCounters.key, key))
      .returning({ hits: rateLimitCounters.hits });

    const hits = row?.hits ?? 1;

    if (hits === 1) {
      // A brand-new window is the cheap moment to sweep buckets nothing will read
      // again. A failure here must not change the verdict, so it is logged only.
      try {
        await db
          .delete(rateLimitCounters)
          .where(
            lt(
              rateLimitCounters.windowStartedAt,
              new Date(now.getTime() - RATE_LIMIT_PRUNE_AFTER_MS),
            ),
          );
      } catch (error) {
        console.error(
          "[contact] could not prune stale rate-limit buckets:",
          error,
        );
      }
    }

    return {
      allowed: hits <= RATE_LIMIT_MAX_HITS,
      hits,
      limit: RATE_LIMIT_MAX_HITS,
    };
  } catch (error) {
    console.error(
      "[contact] rate limiter unavailable; allowing this submission through:",
      error,
    );

    return { allowed: true, hits: 0, limit: RATE_LIMIT_MAX_HITS };
  }
}
