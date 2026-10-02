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
  type SocialPostCard,
  type SocialPostRow,
  type SocialPlatform,
} from "../lib/catalog/social-posts";

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

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(` ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(` ❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log("🧪 STARTING SOCIAL POSTS TESTS...");

// --- ids -------------------------------------------------------------------
const idA = newSocialPostId();
const idB = newSocialPostId();

assert(
  idA.startsWith("sop_"),
  "Generated id is prefixed so it is recognisable",
);
assert(idA !== idB, "Two ids generated in the same tick still differ");

// --- image URL validation --------------------------------------------------
assert(
  isAllowedPostImageUrl("https://ik.imagekit.io/kyfkw6hca/a.jpg"),
  "An https ImageKit URL is allowed",
);
assert(
  isAllowedPostImageUrl("/social/local.png"),
  "A site-relative path is allowed",
);
assert(
  !isAllowedPostImageUrl("//evil.example.com/a.jpg"),
  "A protocol-relative URL is rejected (it would inherit the page scheme)",
);
assert(
  !isAllowedPostImageUrl("javascript:alert(1)"),
  "A javascript: URL is rejected",
);
assert(
  !isAllowedPostImageUrl("http://insecure.example.com/a.jpg"),
  "A plain http URL is rejected",
);
assert(!isAllowedPostImageUrl(""), "An empty image URL is rejected");
assert(
  !isAllowedPostImageUrl("   "),
  "A whitespace-only image URL is rejected",
);
assert(!isAllowedPostImageUrl(null), "A non-string image URL is rejected");

// --- permalink validation --------------------------------------------------
assert(
  isAllowedPermalink("https://www.instagram.com/p/ABC123/"),
  "An Instagram post permalink is allowed",
);
assert(
  isAllowedPermalink("https://instagram.com/reel/ABC123/"),
  "An Instagram reel permalink is allowed",
);
assert(
  isAllowedPermalink(""),
  "A blank permalink is allowed (a post can be staged without its link)",
);
assert(
  isAllowedPermalink("https://tiktok.com/@brand/video/1"),
  "A permalink on any other https host is allowed — a hard host list only breaks the next platform the brand adds",
);
assert(
  !isAllowedPermalink("http://www.instagram.com/p/ABC123/"),
  "A plain http permalink is rejected",
);
assert(
  !isAllowedPermalink("javascript:alert(1)"),
  "A javascript: permalink is rejected",
);
assert(!isAllowedPermalink("not a url"), "A malformed permalink is rejected");

// --- the mistake that 500'd the storefront ---------------------------------
assert(
  imageLooksLikePostLink(
    "https://www.instagram.com/weskateco/p/ABC/",
    "https://www.instagram.com/weskateco/p/ABC/",
  ),
  "Pasting the post link into the image field is detected",
);
assert(
  imageLooksLikePostLink(
    "  https://www.instagram.com/weskateco/p/ABC/  ",
    "https://www.instagram.com/weskateco/p/ABC/",
  ),
  "That detection ignores surrounding whitespace",
);
assert(
  !imageLooksLikePostLink(
    "https://ik.imagekit.io/kyfkw6hca/social/a.jpg",
    "https://www.instagram.com/p/ABC/",
  ),
  "A real image URL alongside a different link is not flagged",
);
assert(
  !imageLooksLikePostLink("https://ik.imagekit.io/kyfkw6hca/social/a.jpg", ""),
  "A post staged with no link yet is not flagged",
);

// --- building the strip ----------------------------------------------------
const built = buildSocialPosts([
  row({ id: "a", permalink: "https://www.instagram.com/p/A/" }),
  row({ id: "b", permalink: null }),
  row({
    id: "c",
    isReel: true,
    permalink: "https://www.instagram.com/reel/C/",
  }),
]);

assert(built.length === 3, "All three valid rows are kept");
assert(
  built[0]?.permalink === "https://www.instagram.com/p/A/",
  "A stored permalink survives verbatim",
);
assert(
  built[1]?.permalink === null,
  "A row without a link keeps null rather than an empty string",
);
assert(
  built[0]?.imageUrl === "https://ik.imagekit.io/kyfkw6hca/social/one.jpg",
  "The image URL is preserved",
);

// A row stored before a validation rule changed must not be able to emit a
// link the browser would not treat as https.
const sanitised = buildSocialPosts([
  row({ permalink: "javascript:alert(1)" }),
  row({ id: "b", permalink: "https://example.com/ok" }),
]);
assert(
  sanitised.length === 2 && sanitised[0]?.permalink === null,
  "A non-https permalink is cleared rather than rendered",
);
assert(
  sanitised[1]?.permalink === "https://example.com/ok",
  "An https permalink on any host is kept",
);

const dropped = buildSocialPosts([row({ imageUrl: "javascript:alert(1)" })]);
assert(
  dropped.length === 0,
  "A row whose image no longer validates is dropped entirely",
);

// The cap matters because this strip renders on every /store page.
const many = buildSocialPosts(
  Array.from({ length: MAX_SOCIAL_POSTS + 5 }, (_, i) =>
    row({ id: `sop_${i}` }),
  ),
);
assert(
  many.length === MAX_SOCIAL_POSTS,
  `The strip is capped at ${MAX_SOCIAL_POSTS} posts`,
);

assert(
  buildSocialPosts([]).length === 0,
  "An empty row list builds an empty strip",
);

// --- platform normalisation ------------------------------------------------
assert(
  normalizePlatform("instagram") === "instagram",
  "A known platform passes through unchanged",
);
assert(
  normalizePlatform("  YouTube  ") === "youtube",
  "A platform is trimmed and lowercased, so ' YouTube ' still matches",
);
assert(
  normalizePlatform("twitter") === "x",
  "The older 'twitter' spelling resolves to x",
);
assert(
  normalizePlatform("snapchat") === "instagram",
  "An unknown platform falls back to Instagram rather than throwing — this runs during render",
);
assert(
  normalizePlatform(null) === "instagram" &&
    normalizePlatform(undefined) === "instagram" &&
    normalizePlatform("") === "instagram",
  "A missing platform falls back to Instagram",
);
assert(
  SOCIAL_PLATFORMS.every((p) => normalizePlatform(p) === p),
  "Every platform in the list round-trips",
);

// --- labels ----------------------------------------------------------------
/** A built card, so `platform` is already narrowed to the union. */
function card(platform: SocialPlatform, isReel = false): SocialPostCard {
  return { ...row(), platform, isReel };
}

assert(
  socialPostActionLabel(card("instagram")) === "View Post",
  "An Instagram post's button reads 'View Post'",
);
assert(
  socialPostActionLabel(card("instagram", true)) === "View Reel",
  "An Instagram reel's button reads 'View Reel'",
);
assert(
  socialPostActionLabel(card("youtube")) === "Watch",
  "A YouTube post is 'Watch', since it is viewed rather than read",
);
assert(
  socialPostActionLabel(card("youtube", true)) === "Watch",
  "YouTube has no reel format, so the flag does not change the verb",
);
assert(
  socialPostActionLabel(card("tiktok")) === "Watch",
  "A TikTok post reads 'Watch'",
);
assert(
  socialPostActionLabel(card("tiktok", true)) === "Watch Reel",
  "A TikTok reel reads 'Watch Reel'",
);
assert(
  socialPostActionLabel(card("linkedin")) === "View Post",
  "A platform with no reel concept still reads 'View Post'",
);

// --- icons -----------------------------------------------------------------
assert(
  hasSocialPlatformIcon("instagram") &&
    hasSocialPlatformIcon("facebook") &&
    hasSocialPlatformIcon("youtube"),
  "The three platforms that ship a real brand icon report having one",
);
assert(
  !hasSocialPlatformIcon("linkedin") &&
    !hasSocialPlatformIcon("tiktok") &&
    !hasSocialPlatformIcon("x"),
  "Platforms with no icon report having none, so the card falls back to text",
);

// --- an unknown platform in a stored row cannot break the strip ------------
const unknownPlatformRow = buildSocialPosts([
  row({ id: "u", platform: "some-network-we-never-added" }),
]);
assert(
  unknownPlatformRow.length === 1 &&
    unknownPlatformRow[0]?.platform === "instagram",
  "A stored row naming an unknown platform still renders, as Instagram",
);

console.log(`\n🎉 TEST RESULTS: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) {
  process.exit(1);
}
