import {
  buildHeroSlides,
  HERO_DEFAULT_SECONDS,
  HERO_MAX_SECONDS,
  HERO_MIN_SECONDS,
  isAllowedHeroUrl,
  isHeroItemKind,
  newHeroItemId,
  nextHeroIndex,
  resolveSeconds,
  type HeroItemInput,
} from "lib/catalog/hero";

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

function item(patch: Partial<HeroItemInput> = {}): HeroItemInput {
  return {
    id: "her_test",
    kind: "image",
    url: "https://cdn.example.com/a.jpg",
    altText: null,
    posterUrl: null,
    seconds: null,
    ...patch,
  };
}

async function main() {
  console.log("\nresolveSeconds");

  equal("an explicit value wins", resolveSeconds(9, 4), 9);
  equal("null falls back to the passed default", resolveSeconds(null, 4), 4);
  equal(
    "undefined falls back to the passed default",
    resolveSeconds(undefined, 4),
    4,
  );
  equal(
    "a missing default falls back to the constant",
    resolveSeconds(null, null),
    HERO_DEFAULT_SECONDS,
  );
  equal(
    "no value and no default uses the constant",
    resolveSeconds(undefined),
    HERO_DEFAULT_SECONDS,
  );
  equal(
    "zero falls back rather than looping with no delay",
    resolveSeconds(0, 4),
    4,
  );
  equal("a negative value falls back", resolveSeconds(-5, 4), 4);
  equal("NaN falls back", resolveSeconds(Number.NaN, 4), 4);
  equal("Infinity falls back", resolveSeconds(Number.POSITIVE_INFINITY, 4), 4);
  equal("a fractional value rounds", resolveSeconds(4.6, null), 5);
  equal(
    "a value below the minimum clamps up",
    resolveSeconds(1, null),
    HERO_MIN_SECONDS,
  );
  equal(
    "a value above the maximum clamps down",
    resolveSeconds(5000, null),
    HERO_MAX_SECONDS,
  );
  equal(
    "the passed default is clamped too",
    resolveSeconds(null, 5000),
    HERO_MAX_SECONDS,
  );

  console.log("\nnextHeroIndex");

  equal("advances to the next slide", nextHeroIndex(0, 3), 1);
  equal("advances again", nextHeroIndex(1, 3), 2);
  equal("the last slide wraps to the first", nextHeroIndex(2, 3), 0);
  equal("a single slide never advances", nextHeroIndex(0, 1), 0);
  equal("an empty list stays at zero", nextHeroIndex(0, 0), 0);
  equal("an out-of-range index resets to the first", nextHeroIndex(9, 3), 0);
  equal("a negative index resets to the first", nextHeroIndex(-1, 3), 0);

  console.log("\nnewHeroItemId");

  check(
    "is prefixed so it is recognisable",
    newHeroItemId().startsWith("her_"),
  );
  check(
    "two calls in the same millisecond still differ",
    newHeroItemId() !== newHeroItemId(),
  );
  check("stays inside the column's length limit", newHeroItemId().length <= 64);

  console.log("\nisAllowedHeroUrl");

  check(
    "an absolute https URL is accepted",
    isAllowedHeroUrl("https://cdn.example.com/a.jpg"),
  );
  check(
    "a third-party https host is accepted - this is the point of not using next/image",
    isAllowedHeroUrl("https://some-other-host.example/deep/path/clip.mp4"),
  );
  check(
    "a site-relative path is accepted",
    isAllowedHeroUrl("/hero/cover_vid.gif"),
  );
  check(
    "surrounding whitespace is tolerated",
    isAllowedHeroUrl("  https://cdn.example.com/a.jpg  "),
  );
  check(
    "an http URL is rejected",
    !isAllowedHeroUrl("http://cdn.example.com/a.jpg"),
  );
  check(
    "a protocol-relative URL is rejected",
    !isAllowedHeroUrl("//cdn.example.com/a.jpg"),
  );
  check(
    "a javascript: URL is rejected",
    !isAllowedHeroUrl("javascript:alert(1)"),
  );
  check(
    "a data: URL is rejected",
    !isAllowedHeroUrl("data:image/png;base64,AAAA"),
  );
  check("an empty string is rejected", !isAllowedHeroUrl(""));
  check("whitespace only is rejected", !isAllowedHeroUrl("   "));
  check("a bare filename is rejected", !isAllowedHeroUrl("cover_vid.gif"));
  check("a non-string is rejected", !isAllowedHeroUrl(42));

  console.log("\nisHeroItemKind");

  check("video is a kind", isHeroItemKind("video"));
  check("image is a kind", isHeroItemKind("image"));
  check(
    "anything else is not",
    !isHeroItemKind("audio") && !isHeroItemKind("") && !isHeroItemKind(null),
  );

  console.log("\nbuildHeroSlides");

  equal("an empty item list yields no slides", buildHeroSlides([]), []);

  const slides = buildHeroSlides(
    [
      item({ id: "a", url: "https://cdn.example.com/a.jpg", seconds: 9 }),
      item({ id: "b", url: "/hero/cover_vid.gif", seconds: null }),
    ],
    4,
  );

  equal(
    "stored order is preserved",
    slides.map((slide) => slide.id),
    ["a", "b"],
  );
  equal("an explicit duration is kept", slides[0]?.seconds, 9);
  equal("a blank duration resolves to the default", slides[1]?.seconds, 4);

  equal(
    "an item whose url is no longer valid is dropped rather than rendered",
    buildHeroSlides([item({ id: "bad", url: "http://insecure.example/x.jpg" })])
      .length,
    0,
  );
  equal(
    "a poster that is not a valid url is cleared",
    buildHeroSlides([
      item({
        kind: "video",
        url: "https://cdn.example.com/clip.mp4",
        posterUrl: "javascript:alert(1)",
      }),
    ])[0]?.posterUrl,
    null,
  );
  equal(
    "a valid poster is kept",
    buildHeroSlides([
      item({
        kind: "video",
        url: "https://cdn.example.com/clip.mp4",
        posterUrl: "https://cdn.example.com/still.jpg",
      }),
    ])[0]?.posterUrl,
    "https://cdn.example.com/still.jpg",
  );
  equal(
    "an unknown kind falls back to image",
    buildHeroSlides([item({ kind: "audio" })])[0]?.kind,
    "image",
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
