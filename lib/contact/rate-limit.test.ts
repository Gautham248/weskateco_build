import {
  clientIdentifierFromHeaders,
  RATE_LIMIT_MAX_HITS,
  RATE_LIMIT_WINDOW_MS,
  rateLimitKey,
  rateLimitWindowStart,
} from "lib/contact/rate-limit";
import { describe, expect, it } from "vitest";

describe("rateLimitWindowStart", () => {
  const tenMinutes = 10 * 60_000;

  it("a time inside the window floors to the window's start", () => {
    expect(
      rateLimitWindowStart(new Date(7 * 60_000), tenMinutes).getTime(),
    ).toBe(0);
  });

  it("an exact boundary stays on that boundary", () => {
    expect(
      rateLimitWindowStart(new Date(tenMinutes), tenMinutes).getTime(),
    ).toBe(tenMinutes);
  });

  it("one millisecond before a boundary is still the previous window", () => {
    expect(
      rateLimitWindowStart(new Date(tenMinutes - 1), tenMinutes).getTime(),
    ).toBe(0);
  });

  it("two instants in the same window share a start", () => {
    expect(
      rateLimitWindowStart(new Date(11 * 60_000), tenMinutes).getTime(),
    ).toBe(rateLimitWindowStart(new Date(19 * 60_000), tenMinutes).getTime());
  });

  it.each([0, 1, 599_999, 600_000, 600_001])(
    "the window start is never in the future: %i",
    (offset) => {
      const now = new Date(offset);

      expect(
        rateLimitWindowStart(now, tenMinutes).getTime(),
      ).toBeLessThanOrEqual(now.getTime());
    },
  );

  it("the default window is the exported constant", () => {
    expect(rateLimitWindowStart(new Date(7 * 60_000)).getTime()).toBe(
      rateLimitWindowStart(
        new Date(7 * 60_000),
        RATE_LIMIT_WINDOW_MS,
      ).getTime(),
    );
  });
});

describe("rateLimitKey", () => {
  it("the same caller on the same route gets the same bucket", () => {
    expect(rateLimitKey("contact/submit", "203.0.113.9")).toBe(
      rateLimitKey("contact/submit", "203.0.113.9"),
    );
  });

  it("different callers get different buckets", () => {
    expect(rateLimitKey("contact/submit", "203.0.113.9")).not.toBe(
      rateLimitKey("contact/submit", "203.0.113.10"),
    );
  });

  it("the same caller on different routes gets different buckets", () => {
    expect(rateLimitKey("contact/submit", "203.0.113.9")).not.toBe(
      rateLimitKey("other/route", "203.0.113.9"),
    );
  });

  // An IP is personal data, and the limiter only needs a stable bucket.
  it("the raw address is never stored in the key", () => {
    expect(rateLimitKey("contact/submit", "203.0.113.9")).not.toContain(
      "203.0.113.9",
    );
  });

  it("the key is prefixed by route, so buckets are readable in the table", () => {
    expect(rateLimitKey("contact/submit", "203.0.113.9")).toMatch(
      /^contact\/submit:/,
    );
  });
});

describe("clientIdentifierFromHeaders", () => {
  // Precedence is the whole point: Vercel documents x-vercel-forwarded-for as the one that
  // survives a proxy in front of Vercel, x-real-ip as identical to x-forwarded-for, and
  // x-forwarded-for as platform-overwritten on Vercel but just a header off it.
  it("x-vercel-forwarded-for wins, being the one that stays correct behind a proxy", () => {
    expect(
      clientIdentifierFromHeaders({
        vercelForwardedFor: "203.0.113.9",
        realIp: "203.0.113.7",
        forwardedFor: "1.2.3.4",
      }),
    ).toBe("203.0.113.9");
  });

  it("a blank x-vercel-forwarded-for falls through instead of winning", () => {
    expect(
      clientIdentifierFromHeaders({
        vercelForwardedFor: "   ",
        realIp: "203.0.113.7",
        forwardedFor: "1.2.3.4",
      }),
    ).toBe("203.0.113.7");
  });

  it("only the first entry of x-vercel-forwarded-for is used", () => {
    expect(
      clientIdentifierFromHeaders({
        vercelForwardedFor: "1.2.3.4, 5.6.7.8",
      }),
    ).toBe("1.2.3.4");
  });

  it("x-real-ip is used when the platform set it", () => {
    expect(clientIdentifierFromHeaders({ realIp: "203.0.113.7" })).toBe(
      "203.0.113.7",
    );
  });

  // Otherwise the limiter is bypassed by rotating the forwarded value while the logs
  // still look limited.
  it("a forwarded-for header cannot override x-real-ip", () => {
    expect(
      clientIdentifierFromHeaders({
        realIp: "203.0.113.7",
        forwardedFor: "1.2.3.4",
      }),
    ).toBe("203.0.113.7");
  });

  it("x-forwarded-for is the fallback when x-real-ip is absent", () => {
    expect(clientIdentifierFromHeaders({ forwardedFor: "1.2.3.4" })).toBe(
      "1.2.3.4",
    );
  });

  it("only the first entry of a forwarded list is used", () => {
    expect(
      clientIdentifierFromHeaders({
        forwardedFor: "1.2.3.4, 5.6.7.8, 9.10.11.12",
      }),
    ).toBe("1.2.3.4");
  });

  it("surrounding whitespace is trimmed", () => {
    expect(clientIdentifierFromHeaders({ realIp: "  203.0.113.7  " })).toBe(
      "203.0.113.7",
    );
  });

  it("a blank x-real-ip falls through instead of becoming the identifier", () => {
    expect(
      clientIdentifierFromHeaders({ realIp: "   ", forwardedFor: "1.2.3.4" }),
    ).toBe("1.2.3.4");
  });

  it("no headers at all yields one shared bucket, not an unlimited one", () => {
    expect(clientIdentifierFromHeaders({})).toBe("unknown");
  });

  it("blank forwarded entries fall through to the shared bucket", () => {
    expect(clientIdentifierFromHeaders({ forwardedFor: " , ," })).toBe(
      "unknown",
    );
  });
});

describe("constants", () => {
  it("the limit is a positive integer", () => {
    expect(Number.isInteger(RATE_LIMIT_MAX_HITS)).toBe(true);
    expect(RATE_LIMIT_MAX_HITS).toBeGreaterThan(0);
  });

  it("the window is a positive duration", () => {
    expect(Number.isFinite(RATE_LIMIT_WINDOW_MS)).toBe(true);
    expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0);
  });
});
