/**
 * Framework-free on purpose: the social-post rules live here so a test script
 * can exercise them without a Next.js runtime, a database, or a network.
 */

export type SocialPost = {
  id: string;
  imageUrl: string;
  altText: string | null;
  permalink: string | null;
  platform: SocialPlatform;
  isReel: boolean;
};

/** What the storefront renders. */
export type SocialPostCard = SocialPost;

/**
 * Mirrors the row shape lib/admin/queries.ts returns. Restated rather than
 * imported so this module stays free of any database import. `platform` is a
 * plain string here because that is what the column holds; buildSocialPosts
 * narrows it.
 */
export type SocialPostRow = {
  id: string;
  imageUrl: string;
  altText: string | null;
  permalink: string | null;
  platform: string;
  isReel: boolean;
};

/**
 * How many cards the strip shows.
 *
 * A cap matters because the store layout renders this section on every page
 * under /store, so an unbounded list would ship every image into every store
 * page. The admin rejects a longer list on save rather than truncating
 * silently, so the cap cannot quietly hide rows somebody added.
 */
export const MAX_SOCIAL_POSTS = 12;

/**
 * Networks a post can belong to.
 *
 * The order is the order the admin's dropdown lists them, which is roughly how
 * a brand actually posts: photo-first networks first, then short-form video,
 * then the text networks. `x` is the current name for Twitter; `twitter` is
 * accepted as an alias so links copied from an older profile URL still work.
 */
export const SOCIAL_PLATFORMS = [
  "instagram",
  "youtube",
  "tiktok",
  "facebook",
  "x",
  "threads",
  "pinterest",
  "linkedin",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/** Human name for the card badge and the admin dropdown. */
export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  threads: "Threads",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
};

/** Older spellings mapped onto the current name. */
const PLATFORM_ALIASES: Record<string, SocialPlatform> = {
  twitter: "x",
  ig: "instagram",
  yt: "youtube",
  fb: "facebook",
};

/**
 * Narrows a stored or submitted value to a known platform.
 *
 * Anything unrecognised becomes Instagram rather than throwing: this runs while
 * rendering the storefront, and a platform nobody has added a card for must not
 * be able to take a page down. It also normalises case and whitespace, so a row
 * stored as "Instagram " still matches.
 */
export function normalizePlatform(value: unknown): SocialPlatform {
  if (typeof value !== "string") {
    return "instagram";
  }

  const lower = value.trim().toLowerCase();

  if (!lower) {
    return "instagram";
  }

  if (lower in PLATFORM_ALIASES) {
    return PLATFORM_ALIASES[lower]!;
  }

  const match = SOCIAL_PLATFORMS.find((platform) => platform === lower);

  return match ?? "instagram";
}

/**
 * Prefixed so an id is recognisable in the database, and random as well as
 * time-based so two posts added inside the same millisecond still differ.
 * Deliberately not crypto.randomUUID(), which needs a secure context and would
 * fail over plain http on a LAN address; hero.ts uses the same trick.
 */
export function newSocialPostId(): string {
  return `sop_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/**
 * Scheme and shape only for the image, matching isAllowedHeroUrl: the storefront
 * renders it with next/image, so an image from any https host is displayable and
 * there is no allowlist to keep in step with next.config.ts.
 */
export function isAllowedPostImageUrl(url: unknown): boolean {
  if (typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return false;
  }

  // Protocol-relative would inherit the page's scheme; reject it explicitly.
  if (trimmed.startsWith("//")) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * A permalink must be an absolute https URL.
 *
 * Any https host is accepted, matching the hero's URL check. An earlier version
 * pinned this to instagram.com, which was over-tightening: the card is a link
 * to wherever the post lives, and a hard host list only breaks the next platform
 * the brand adds.
 *
 * An empty permalink is allowed — a post can be staged before its link is known,
 * and such a card renders inert rather than linking nowhere.
 */
export function isAllowedPermalink(url: unknown): boolean {
  if (typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return true;
  }

  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * True when the image field was given what is really the post's own link.
 *
 * Not a hard error — some hosts serve an image from the post URL, and we cannot
 * know without fetching it — but pasting the same value into both fields is by
 * far the most common mistake, and the symptom is a card that cannot render.
 * The admin surfaces this as a warning rather than blocking the save.
 */
export function imageLooksLikePostLink(
  imageUrl: string,
  permalink: string,
): boolean {
  const image = imageUrl.trim();
  const link = permalink.trim();

  if (!image || !link) {
    return false;
  }

  return image === link;
}

/**
 * Pure and synchronous so it can be tested without a database.
 *
 * An item whose image no longer passes validation is dropped rather than
 * rendered, and a permalink that would not is cleared: a row stored before a
 * rule changed must never be able to break the homepage or emit an off-brand
 * outbound link.
 */
export function buildSocialPosts(rows: SocialPostRow[]): SocialPostCard[] {
  const cards: SocialPostCard[] = [];

  for (const row of rows) {
    if (!isAllowedPostImageUrl(row.imageUrl)) {
      continue;
    }

    const permalink =
      row.permalink && isAllowedPermalink(row.permalink)
        ? row.permalink.trim()
        : null;

    cards.push({
      id: row.id,
      imageUrl: row.imageUrl.trim(),
      altText: row.altText,
      permalink,
      platform: normalizePlatform(row.platform),
      isReel: row.isReel,
    });
  }

  return cards.slice(0, MAX_SOCIAL_POSTS);
}

/**
 * The label the card's action button shows.
 *
 * YouTube and TikTok are watched rather than read, so "Watch" reads better
 * there than "View". Everything else is a written post.
 */
export function socialPostActionLabel(post: SocialPostCard): string {
  if (post.platform === "youtube") {
    return "Watch";
  }

  if (post.platform === "tiktok") {
    return post.isReel ? "Watch Reel" : "Watch";
  }

  return post.isReel ? "View Reel" : "View Post";
}

/**
 * Whether a real brand icon exists for a platform.
 *
 * Only three networks ship an icon in components/icons. Rather than hand-draw
 * the rest — approximations of someone else's logo look wrong and carry
 * licensing questions — the card falls back to the platform name in words, which
 * reads as deliberate rather than missing.
 */
export function hasSocialPlatformIcon(platform: SocialPlatform): boolean {
  return (
    platform === "instagram" ||
    platform === "facebook" ||
    platform === "youtube"
  );
}
