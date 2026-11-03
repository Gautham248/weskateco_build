import {
  ENQUIRY_REFERENCE_ALPHABET,
  ENQUIRY_REFERENCE_LENGTH,
  generateEnquiryId,
  newEnquiryReference,
} from "lib/contact/enquiry-reference";
import {
  clientIdentifierFromHeaders,
  RATE_LIMIT_MAX_HITS,
  RATE_LIMIT_WINDOW_MS,
  rateLimitKey,
  rateLimitWindowStart,
} from "lib/contact/rate-limit";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

const REFERENCE_SHAPE = new RegExp(
  `^[${ENQUIRY_REFERENCE_ALPHABET}]{${ENQUIRY_REFERENCE_LENGTH}}$`,
);

function main() {
  console.log("\nnewEnquiryReference");

  equal(
    "the default length is six characters",
    newEnquiryReference().length,
    ENQUIRY_REFERENCE_LENGTH,
  );

  check(
    "every character comes from the reference alphabet",
    Array.from({ length: 500 }, () => newEnquiryReference()).every(
      (reference) => REFERENCE_SHAPE.test(reference),
    ),
  );

  check(
    "the alphabet omits every character a person could misread",
    !"0O1IL"
      .split("")
      .some((character) => ENQUIRY_REFERENCE_ALPHABET.includes(character)),
    `alphabet is ${ENQUIRY_REFERENCE_ALPHABET}`,
  );

  check(
    "the whole alphabet is reachable, so no symbol is dead weight",
    (() => {
      const drawn = Array.from({ length: 3000 }, () =>
        newEnquiryReference(),
      ).join("");

      return ENQUIRY_REFERENCE_ALPHABET.split("").every((character) =>
        drawn.includes(character),
      );
    })(),
  );

  check(
    "200 draws are all distinct",
    (() => {
      const drawn = Array.from({ length: 200 }, () => newEnquiryReference());

      return new Set(drawn).size === drawn.length;
    })(),
    "a duplicate here would mean the generator is not random enough to be unique",
  );

  check(
    "a requested length is honoured",
    newEnquiryReference(10).length === 10,
  );

  console.log("\ngenerateEnquiryId");

  check(
    "the date part is the UTC date, so the same instant is the same reference anywhere",
    generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")).startsWith(
      "PRD-260924-",
    ),
  );

  check(
    "a late-in-the-day UTC instant is not rolled into the next day",
    generateEnquiryId("PRD", new Date("2026-12-31T23:59:00.000Z")).startsWith(
      "PRD-261231-",
    ),
  );

  check(
    "the whole reference matches PREFIX-YYMMDD-XXXXXX",
    /^PRD-\d{6}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/.test(
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
    ),
  );

  check(
    "the caller's prefix is used verbatim",
    generateEnquiryId("SPAM", new Date("2026-09-24T07:45:21.871Z")).startsWith(
      "SPAM-",
    ),
  );

  check(
    "two references generated in the same instant differ",
    generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")) !==
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
  );

  equal(
    "the reference is 17 characters, short enough to read aloud",
    generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")).length,
    17,
  );

  console.log("\nrateLimitWindowStart");

  const tenMinutes = 10 * 60_000;

  equal(
    "a time inside the window floors to the window's start",
    rateLimitWindowStart(new Date(7 * 60_000), tenMinutes).getTime(),
    0,
  );

  equal(
    "an exact boundary stays on that boundary",
    rateLimitWindowStart(new Date(tenMinutes), tenMinutes).getTime(),
    tenMinutes,
  );

  equal(
    "one millisecond before a boundary is still the previous window",
    rateLimitWindowStart(new Date(tenMinutes - 1), tenMinutes).getTime(),
    0,
  );

  check(
    "two instants in the same window share a start",
    rateLimitWindowStart(new Date(11 * 60_000), tenMinutes).getTime() ===
      rateLimitWindowStart(new Date(19 * 60_000), tenMinutes).getTime(),
  );

  check(
    "the window start is never in the future",
    [0, 1, 599_999, 600_000, 600_001].every((offset) => {
      const now = new Date(offset);

      return rateLimitWindowStart(now, tenMinutes).getTime() <= now.getTime();
    }),
  );

  equal(
    "the default window is the exported constant",
    rateLimitWindowStart(new Date(7 * 60_000)).getTime(),
    rateLimitWindowStart(new Date(7 * 60_000), RATE_LIMIT_WINDOW_MS).getTime(),
  );

  console.log("\nrateLimitKey");

  equal(
    "the same caller on the same route gets the same bucket",
    rateLimitKey("contact/submit", "203.0.113.9"),
    rateLimitKey("contact/submit", "203.0.113.9"),
  );

  check(
    "different callers get different buckets",
    rateLimitKey("contact/submit", "203.0.113.9") !==
      rateLimitKey("contact/submit", "203.0.113.10"),
  );

  check(
    "the same caller on different routes gets different buckets",
    rateLimitKey("contact/submit", "203.0.113.9") !==
      rateLimitKey("other/route", "203.0.113.9"),
  );

  check(
    "the raw address is never stored in the key",
    !rateLimitKey("contact/submit", "203.0.113.9").includes("203.0.113.9"),
    "an IP is personal data, and the limiter only needs a stable bucket",
  );

  check(
    "the key is prefixed by route, so buckets are readable in the table",
    rateLimitKey("contact/submit", "203.0.113.9").startsWith("contact/submit:"),
  );

  console.log("\nclientIdentifierFromHeaders");

  // Precedence is the whole point: Vercel documents x-vercel-forwarded-for as the one that
  // survives a proxy in front of Vercel, x-real-ip as identical to x-forwarded-for, and
  // x-forwarded-for as platform-overwritten on Vercel but just a header off it.
  equal(
    "x-vercel-forwarded-for wins, being the one that stays correct behind a proxy",
    clientIdentifierFromHeaders({
      vercelForwardedFor: "203.0.113.9",
      realIp: "203.0.113.7",
      forwardedFor: "1.2.3.4",
    }),
    "203.0.113.9",
  );

  equal(
    "a blank x-vercel-forwarded-for falls through instead of winning",
    clientIdentifierFromHeaders({
      vercelForwardedFor: "   ",
      realIp: "203.0.113.7",
      forwardedFor: "1.2.3.4",
    }),
    "203.0.113.7",
  );

  equal(
    "only the first entry of x-vercel-forwarded-for is used",
    clientIdentifierFromHeaders({
      vercelForwardedFor: "1.2.3.4, 5.6.7.8",
    }),
    "1.2.3.4",
  );

  equal(
    "x-real-ip is used when the platform set it",
    clientIdentifierFromHeaders({ realIp: "203.0.113.7" }),
    "203.0.113.7",
  );

  check(
    "a forwarded-for header cannot override x-real-ip",
    clientIdentifierFromHeaders({
      realIp: "203.0.113.7",
      forwardedFor: "1.2.3.4",
    }) === "203.0.113.7",
    "otherwise the limiter is bypassed by rotating the forwarded value while the logs still look limited",
  );

  equal(
    "x-forwarded-for is the fallback when x-real-ip is absent",
    clientIdentifierFromHeaders({ forwardedFor: "1.2.3.4" }),
    "1.2.3.4",
  );

  equal(
    "only the first entry of a forwarded list is used",
    clientIdentifierFromHeaders({
      forwardedFor: "1.2.3.4, 5.6.7.8, 9.10.11.12",
    }),
    "1.2.3.4",
  );

  equal(
    "surrounding whitespace is trimmed",
    clientIdentifierFromHeaders({ realIp: "  203.0.113.7  " }),
    "203.0.113.7",
  );

  equal(
    "a blank x-real-ip falls through instead of becoming the identifier",
    clientIdentifierFromHeaders({ realIp: "   ", forwardedFor: "1.2.3.4" }),
    "1.2.3.4",
  );

  equal(
    "no headers at all yields one shared bucket, not an unlimited one",
    clientIdentifierFromHeaders({}),
    "unknown",
  );

  equal(
    "blank forwarded entries fall through to the shared bucket",
    clientIdentifierFromHeaders({ forwardedFor: " , ," }),
    "unknown",
  );

  console.log("\nconstants");

  check(
    "the limit is a positive integer",
    Number.isInteger(RATE_LIMIT_MAX_HITS) && RATE_LIMIT_MAX_HITS > 0,
  );

  check(
    "the window is a positive duration",
    Number.isFinite(RATE_LIMIT_WINDOW_MS) && RATE_LIMIT_WINDOW_MS > 0,
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main();
