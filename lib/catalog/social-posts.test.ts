import {
  buildSocialPosts,
  hasSocialPlatformIcon,
  imageLooksLikePostLink,
  isAllowedPermalink,
  isAllowedPostImageUrl,
  MAX_SOCIAL_POSTS,
  newSocialPostId,
  normalizePlatform,
  SOCIAL_PLATFORMS,
  socialPostActionLabel,
  type SocialPlatform,
  type SocialPostCard,
  type SocialPostRow,
} from "lib/catalog/social-posts";
import { describe, expect, it } from "vitest";

/**
 * Exercises the pure social-post rules.
 *
 * The behaviour under test is the reason this feature exists: the strip used to
 * render five committed screenshots with a dead "View Post" button, so what
 * matters is that a curated row now produces a real link, that an invalid one is
 * dropped rather than rendered, and that the two failure modes stay distinct.
 */

function row(overrides: Partial<SocialPostRow> = {}): SocialPostRow {
  return {
    id: "sop_test",
    imageUrl: "https://ik.imagekit.io/kyfkw6hca/social/one.jpg",
    altText: null,
    permalink: null,
    platform: "instagram",
    isReel: false,
    ...overrides,
  };
}

/** A built card, so `platform` is already narrowed to the union. */
function card(platform: SocialPlatform, isReel = false): SocialPostCard {
  return { ...row(), platform, isReel };
}

describe("ids", () => {
  const idA = newSocialPostId();
  const idB = newSocialPostId();

  it("Generated id is prefixed so it is recognisable", () => {
    expect(idA).toMatch(/^sop_/);
  });

  it("Two ids generated in the same tick still differ", () => {
    expect(idA).not.toBe(idB);
  });
});

describe("image URL validation", () => {
  it("An https ImageKit URL is allowed", () => {
    expect(
      isAllowedPostImageUrl("https://ik.imagekit.io/kyfkw6hca/a.jpg"),
    ).toBe(true);
  });

  it("A site-relative path is allowed", () => {
    expect(isAllowedPostImageUrl("/social/local.png")).toBe(true);
  });

  it("A protocol-relative URL is rejected (it would inherit the page scheme)", () => {
    expect(isAllowedPostImageUrl("//evil.example.com/a.jpg")).toBe(false);
  });

  it("A javascript: URL is rejected", () => {
    expect(isAllowedPostImageUrl("javascript:alert(1)")).toBe(false);
  });

  it("A plain http URL is rejected", () => {
    expect(isAllowedPostImageUrl("http://insecure.example.com/a.jpg")).toBe(
      false,
    );
  });

  it("An empty image URL is rejected", () => {
    expect(isAllowedPostImageUrl("")).toBe(false);
  });

  it("A whitespace-only image URL is rejected", () => {
    expect(isAllowedPostImageUrl("   ")).toBe(false);
  });

  it("A non-string image URL is rejected", () => {
    expect(isAllowedPostImageUrl(null)).toBe(false);
  });
});

describe("permalink validation", () => {
  it("An Instagram post permalink is allowed", () => {
    expect(isAllowedPermalink("https://www.instagram.com/p/ABC123/")).toBe(
      true,
    );
  });

  it("An Instagram reel permalink is allowed", () => {
    expect(isAllowedPermalink("https://instagram.com/reel/ABC123/")).toBe(true);
  });

  it("A blank permalink is allowed (a post can be staged without its link)", () => {
    expect(isAllowedPermalink("")).toBe(true);
  });

  it("A permalink on any other https host is allowed — a hard host list only breaks the next platform the brand adds", () => {
    expect(isAllowedPermalink("https://tiktok.com/@brand/video/1")).toBe(true);
  });

  it("A plain http permalink is rejected", () => {
    expect(isAllowedPermalink("http://www.instagram.com/p/ABC123/")).toBe(
      false,
    );
  });

  it("A javascript: permalink is rejected", () => {
    expect(isAllowedPermalink("javascript:alert(1)")).toBe(false);
  });

  it("A malformed permalink is rejected", () => {
    expect(isAllowedPermalink("not a url")).toBe(false);
  });
});

describe("the mistake that 500'd the storefront", () => {
  it("Pasting the post link into the image field is detected", () => {
    expect(
      imageLooksLikePostLink(
        "https://www.instagram.com/weskateco/p/ABC/",
        "https://www.instagram.com/weskateco/p/ABC/",
      ),
    ).toBe(true);
  });

  it("That detection ignores surrounding whitespace", () => {
    expect(
      imageLooksLikePostLink(
        "  https://www.instagram.com/weskateco/p/ABC/  ",
        "https://www.instagram.com/weskateco/p/ABC/",
      ),
    ).toBe(true);
  });

  it("A real image URL alongside a different link is not flagged", () => {
    expect(
      imageLooksLikePostLink(
        "https://ik.imagekit.io/kyfkw6hca/social/a.jpg",
        "https://www.instagram.com/p/ABC/",
      ),
    ).toBe(false);
  });

  it("A post staged with no link yet is not flagged", () => {
    expect(
      imageLooksLikePostLink(
        "https://ik.imagekit.io/kyfkw6hca/social/a.jpg",
        "",
      ),
    ).toBe(false);
  });
});

describe("building the strip", () => {
  const built = buildSocialPosts([
    row({ id: "a", permalink: "https://www.instagram.com/p/A/" }),
    row({ id: "b", permalink: null }),
    row({
      id: "c",
      isReel: true,
      permalink: "https://www.instagram.com/reel/C/",
    }),
  ]);

  it("All three valid rows are kept", () => {
    expect(built).toHaveLength(3);
  });

  it("A stored permalink survives verbatim", () => {
    expect(built[0]?.permalink).toBe("https://www.instagram.com/p/A/");
  });

  it("A row without a link keeps null rather than an empty string", () => {
    expect(built[1]?.permalink).toBeNull();
  });

  it("The image URL is preserved", () => {
    expect(built[0]?.imageUrl).toBe(
      "https://ik.imagekit.io/kyfkw6hca/social/one.jpg",
    );
  });

  // A row stored before a validation rule changed must not be able to emit a
  // link the browser would not treat as https.
  describe("rows stored under older validation rules", () => {
    const sanitised = buildSocialPosts([
      row({ permalink: "javascript:alert(1)" }),
      row({ id: "b", permalink: "https://example.com/ok" }),
    ]);

    it("A non-https permalink is cleared rather than rendered", () => {
      expect(sanitised).toHaveLength(2);
      expect(sanitised[0]?.permalink).toBeNull();
    });

    it("An https permalink on any host is kept", () => {
      expect(sanitised[1]?.permalink).toBe("https://example.com/ok");
    });

    it("A row whose image no longer validates is dropped entirely", () => {
      const dropped = buildSocialPosts([
        row({ imageUrl: "javascript:alert(1)" }),
      ]);

      expect(dropped).toHaveLength(0);
    });
  });

  // The cap matters because this strip renders on every /store page.
  it(`The strip is capped at ${MAX_SOCIAL_POSTS} posts`, () => {
    const many = buildSocialPosts(
      Array.from({ length: MAX_SOCIAL_POSTS + 5 }, (_, i) =>
        row({ id: `sop_${i}` }),
      ),
    );

    expect(many).toHaveLength(MAX_SOCIAL_POSTS);
  });

  it("An empty row list builds an empty strip", () => {
    expect(buildSocialPosts([])).toHaveLength(0);
  });
});

describe("platform normalisation", () => {
  it("A known platform passes through unchanged", () => {
    expect(normalizePlatform("instagram")).toBe("instagram");
  });

  it("A platform is trimmed and lowercased, so ' YouTube ' still matches", () => {
    expect(normalizePlatform("  YouTube  ")).toBe("youtube");
  });

  it("The older 'twitter' spelling resolves to x", () => {
    expect(normalizePlatform("twitter")).toBe("x");
  });

  it("An unknown platform falls back to Instagram rather than throwing — this runs during render", () => {
    expect(normalizePlatform("snapchat")).toBe("instagram");
  });

  it("A missing platform falls back to Instagram", () => {
    expect(normalizePlatform(null)).toBe("instagram");
    expect(normalizePlatform(undefined)).toBe("instagram");
    expect(normalizePlatform("")).toBe("instagram");
  });

  it("Every platform in the list round-trips", () => {
    expect(SOCIAL_PLATFORMS.map((p) => normalizePlatform(p))).toEqual([
      ...SOCIAL_PLATFORMS,
    ]);
  });
});

describe("labels", () => {
  it("An Instagram post's button reads 'View Post'", () => {
    expect(socialPostActionLabel(card("instagram"))).toBe("View Post");
  });

  it("An Instagram reel's button reads 'View Reel'", () => {
    expect(socialPostActionLabel(card("instagram", true))).toBe("View Reel");
  });

  it("A YouTube post is 'Watch', since it is viewed rather than read", () => {
    expect(socialPostActionLabel(card("youtube"))).toBe("Watch");
  });

  it("YouTube has no reel format, so the flag does not change the verb", () => {
    expect(socialPostActionLabel(card("youtube", true))).toBe("Watch");
  });

  it("A TikTok post reads 'Watch'", () => {
    expect(socialPostActionLabel(card("tiktok"))).toBe("Watch");
  });

  it("A TikTok reel reads 'Watch Reel'", () => {
    expect(socialPostActionLabel(card("tiktok", true))).toBe("Watch Reel");
  });

  it("A platform with no reel concept still reads 'View Post'", () => {
    expect(socialPostActionLabel(card("linkedin"))).toBe("View Post");
  });
});

describe("icons", () => {
  it("The three platforms that ship a real brand icon report having one", () => {
    expect(hasSocialPlatformIcon("instagram")).toBe(true);
    expect(hasSocialPlatformIcon("facebook")).toBe(true);
    expect(hasSocialPlatformIcon("youtube")).toBe(true);
  });

  it("Platforms with no icon report having none, so the card falls back to text", () => {
    expect(hasSocialPlatformIcon("linkedin")).toBe(false);
    expect(hasSocialPlatformIcon("tiktok")).toBe(false);
    expect(hasSocialPlatformIcon("x")).toBe(false);
  });
});

describe("an unknown platform in a stored row cannot break the strip", () => {
  it("A stored row naming an unknown platform still renders, as Instagram", () => {
    const unknownPlatformRow = buildSocialPosts([
      row({ id: "u", platform: "some-network-we-never-added" }),
    ]);

    expect(unknownPlatformRow).toHaveLength(1);
    expect(unknownPlatformRow[0]?.platform).toBe("instagram");
  });
});
