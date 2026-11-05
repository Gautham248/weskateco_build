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
import { describe, expect, it } from "vitest";

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

describe("resolveSeconds", () => {
  it("an explicit value wins", () => {
    expect(resolveSeconds(9, 4)).toBe(9);
  });

  it("null falls back to the passed default", () => {
    expect(resolveSeconds(null, 4)).toBe(4);
  });

  it("undefined falls back to the passed default", () => {
    expect(resolveSeconds(undefined, 4)).toBe(4);
  });

  it("a missing default falls back to the constant", () => {
    expect(resolveSeconds(null, null)).toBe(HERO_DEFAULT_SECONDS);
  });

  it("no value and no default uses the constant", () => {
    expect(resolveSeconds(undefined)).toBe(HERO_DEFAULT_SECONDS);
  });

  it("zero falls back rather than looping with no delay", () => {
    expect(resolveSeconds(0, 4)).toBe(4);
  });

  it("a negative value falls back", () => {
    expect(resolveSeconds(-5, 4)).toBe(4);
  });

  it("NaN falls back", () => {
    expect(resolveSeconds(Number.NaN, 4)).toBe(4);
  });

  it("Infinity falls back", () => {
    expect(resolveSeconds(Number.POSITIVE_INFINITY, 4)).toBe(4);
  });

  it("a fractional value rounds", () => {
    expect(resolveSeconds(4.6, null)).toBe(5);
  });

  it("a value below the minimum clamps up", () => {
    expect(resolveSeconds(1, null)).toBe(HERO_MIN_SECONDS);
  });

  it("a value above the maximum clamps down", () => {
    expect(resolveSeconds(5000, null)).toBe(HERO_MAX_SECONDS);
  });

  it("the passed default is clamped too", () => {
    expect(resolveSeconds(null, 5000)).toBe(HERO_MAX_SECONDS);
  });
});

describe("nextHeroIndex", () => {
  it("advances to the next slide", () => {
    expect(nextHeroIndex(0, 3)).toBe(1);
  });

  it("advances again", () => {
    expect(nextHeroIndex(1, 3)).toBe(2);
  });

  it("the last slide wraps to the first", () => {
    expect(nextHeroIndex(2, 3)).toBe(0);
  });

  it("a single slide never advances", () => {
    expect(nextHeroIndex(0, 1)).toBe(0);
  });

  it("an empty list stays at zero", () => {
    expect(nextHeroIndex(0, 0)).toBe(0);
  });

  it("an out-of-range index resets to the first", () => {
    expect(nextHeroIndex(9, 3)).toBe(0);
  });

  it("a negative index resets to the first", () => {
    expect(nextHeroIndex(-1, 3)).toBe(0);
  });
});

describe("newHeroItemId", () => {
  it("is prefixed so it is recognisable", () => {
    expect(newHeroItemId()).toMatch(/^her_/);
  });

  it("two calls in the same millisecond still differ", () => {
    expect(newHeroItemId()).not.toBe(newHeroItemId());
  });

  it("stays inside the column's length limit", () => {
    expect(newHeroItemId().length).toBeLessThanOrEqual(64);
  });
});

describe("isAllowedHeroUrl", () => {
  it("an absolute https URL is accepted", () => {
    expect(isAllowedHeroUrl("https://cdn.example.com/a.jpg")).toBe(true);
  });

  it("a third-party https host is accepted - this is the point of not using next/image", () => {
    expect(
      isAllowedHeroUrl("https://some-other-host.example/deep/path/clip.mp4"),
    ).toBe(true);
  });

  it("a site-relative path is accepted", () => {
    expect(isAllowedHeroUrl("/hero/cover_vid.gif")).toBe(true);
  });

  it("surrounding whitespace is tolerated", () => {
    expect(isAllowedHeroUrl("  https://cdn.example.com/a.jpg  ")).toBe(true);
  });

  it("an http URL is rejected", () => {
    expect(isAllowedHeroUrl("http://cdn.example.com/a.jpg")).toBe(false);
  });

  it("a protocol-relative URL is rejected", () => {
    expect(isAllowedHeroUrl("//cdn.example.com/a.jpg")).toBe(false);
  });

  it("a javascript: URL is rejected", () => {
    expect(isAllowedHeroUrl("javascript:alert(1)")).toBe(false);
  });

  it("a data: URL is rejected", () => {
    expect(isAllowedHeroUrl("data:image/png;base64,AAAA")).toBe(false);
  });

  it("an empty string is rejected", () => {
    expect(isAllowedHeroUrl("")).toBe(false);
  });

  it("whitespace only is rejected", () => {
    expect(isAllowedHeroUrl("   ")).toBe(false);
  });

  it("a bare filename is rejected", () => {
    expect(isAllowedHeroUrl("cover_vid.gif")).toBe(false);
  });

  it("a non-string is rejected", () => {
    expect(isAllowedHeroUrl(42)).toBe(false);
  });
});

describe("isHeroItemKind", () => {
  it("video is a kind", () => {
    expect(isHeroItemKind("video")).toBe(true);
  });

  it("image is a kind", () => {
    expect(isHeroItemKind("image")).toBe(true);
  });

  it("anything else is not", () => {
    expect(isHeroItemKind("audio")).toBe(false);
    expect(isHeroItemKind("")).toBe(false);
    expect(isHeroItemKind(null)).toBe(false);
  });
});

describe("buildHeroSlides", () => {
  it("an empty item list yields no slides", () => {
    expect(buildHeroSlides([])).toEqual([]);
  });

  describe("with an explicit and a blank duration", () => {
    const slides = buildHeroSlides(
      [
        item({ id: "a", url: "https://cdn.example.com/a.jpg", seconds: 9 }),
        item({ id: "b", url: "/hero/cover_vid.gif", seconds: null }),
      ],
      4,
    );

    it("stored order is preserved", () => {
      expect(slides.map((slide) => slide.id)).toEqual(["a", "b"]);
    });

    it("an explicit duration is kept", () => {
      expect(slides[0]?.seconds).toBe(9);
    });

    it("a blank duration resolves to the default", () => {
      expect(slides[1]?.seconds).toBe(4);
    });
  });

  it("an item whose url is no longer valid is dropped rather than rendered", () => {
    expect(
      buildHeroSlides([
        item({ id: "bad", url: "http://insecure.example/x.jpg" }),
      ]),
    ).toHaveLength(0);
  });

  it("a poster that is not a valid url is cleared", () => {
    expect(
      buildHeroSlides([
        item({
          kind: "video",
          url: "https://cdn.example.com/clip.mp4",
          posterUrl: "javascript:alert(1)",
        }),
      ])[0]?.posterUrl,
    ).toBeNull();
  });

  it("a valid poster is kept", () => {
    expect(
      buildHeroSlides([
        item({
          kind: "video",
          url: "https://cdn.example.com/clip.mp4",
          posterUrl: "https://cdn.example.com/still.jpg",
        }),
      ])[0]?.posterUrl,
    ).toBe("https://cdn.example.com/still.jpg");
  });

  it("an unknown kind falls back to image", () => {
    expect(buildHeroSlides([item({ kind: "audio" })])[0]?.kind).toBe("image");
  });
});
