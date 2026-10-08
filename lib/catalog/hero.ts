/**
 * Framework-free on purpose: the hero's rules live here so a test script can
 * exercise them without a Next.js runtime, a database, or Shopify.
 */

export const HERO_DEFAULT_SECONDS = 6;
export const HERO_MIN_SECONDS = 2;
export const HERO_MAX_SECONDS = 60;

export type HeroItemKind = "video" | "image";

export type HeroSlide = {
  id: string;
  kind: HeroItemKind;
  url: string;
  altText: string | null;
  posterUrl: string | null;
  seconds: number;
};

/**
 * What the storefront is handed. `failed` is deliberately distinct from an empty
 * `ok`: an unreadable config (a database blip, or a deploy that landed before the
 * migration ran) must fall back to a built-in slide, whereas a list the admin
 * emptied on purpose hides the section.
 */
export type HeroConfig =
  | { status: "ok"; slides: HeroSlide[]; defaultSeconds: number }
  | { status: "failed" };

/**
 * Mirrors the row shape lib/admin/queries.ts returns. Restated rather than
 * imported so this module stays free of any database import.
 */
export type HeroItemInput = {
  id: string;
  kind: string;
  url: string;
  altText: string | null;
  posterUrl: string | null;
  seconds: number | null;
};

/** Rendered when the config cannot be read at all. See HeroConfig above. */
export const HERO_FALLBACK_SLIDE: HeroSlide = {
  id: "hero-fallback",
  kind: "image",
  url: "/hero/cover_vid.gif",
  altText: "WeSkate Co",
  posterUrl: null,
  seconds: HERO_DEFAULT_SECONDS,
};

/**
 * What the database read hands back. A discriminated result rather than a thrown
 * error, because that read runs inside a "use cache" function and letting an
 * error escape one of those surfaces as an unhandled 500 even when the caller
 * catches it.
 */
export type HeroRowsResult =
  | { status: "ok"; items: HeroItemInput[]; defaultSeconds: number | null }
  | { status: "failed" };

/**
 * Prefixed so an id is recognisable in the database, and random as well as
 * time-based so two items added inside the same millisecond still differ.
 * Deliberately not crypto.randomUUID(), which needs a secure context and would
 * fail over plain http on a LAN address; image-manager.tsx uses the same trick
 * for its editor keys.
 */
export function newHeroItemId(): string {
  return `her_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function normalizeSeconds(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const rounded = Math.round(value);

  return rounded > 0 ? rounded : null;
}

/**
 * Item value wins, then the hero default, then the constant. Anything unusable
 * (null, zero, negative, NaN) falls through rather than producing a zero-delay
 * loop, and the result is clamped so a stray 5000 cannot park the hero on one
 * slide for an hour.
 */
export function resolveSeconds(
  seconds: number | null | undefined,
  defaultSeconds?: number | null,
): number {
  const chosen =
    normalizeSeconds(seconds) ??
    normalizeSeconds(defaultSeconds) ??
    HERO_DEFAULT_SECONDS;

  return Math.min(Math.max(chosen, HERO_MIN_SECONDS), HERO_MAX_SECONDS);
}

/**
 * Wraps the last slide back to the first. A hero with one slide, or none, must
 * never schedule a timer, so anything at or below one item resolves to 0.
 */
export function nextHeroIndex(current: number, count: number): number {
  if (!Number.isFinite(count) || count <= 1) {
    return 0;
  }

  if (!Number.isFinite(current) || current < 0 || current >= count - 1) {
    return 0;
  }

  return Math.floor(current) + 1;
}

/**
 * Scheme and shape only - deliberately not a host allowlist. The hero renders
 * plain <img>/<video> rather than next/image, so an image from any https host is
 * displayable and there is no allowlist to keep in step with next.config.ts.
 */
export function isAllowedHeroUrl(url: unknown): boolean {
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

export function isHeroItemKind(value: unknown): value is HeroItemKind {
  return value === "video" || value === "image";
}

/**
 * ImageKit serves a video's first frame when `/ik-thumbnail.jpg` is appended to
 * the file's URL, and picks the best format for the requesting device.
 */
const IMAGEKIT_HOST = "imagekit.io";

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "mkv"]);

/**
 * Derives a poster from a video's own URL, so a video slide shows a real frame
 * while it buffers instead of a blank rectangle.
 *
 * Deliberately limited to ImageKit over https: that is the one host whose
 * thumbnail convention is known here, so deriving for an arbitrary CDN URL
 * would produce a link that 404s. A site-relative path (a file in public/) has
 * no equivalent, so it yields null and the slide simply goes without a poster.
 *
 * No `tr` parameter is added on purpose. ImageKit auto-optimises the bare form
 * to roughly 60KB, whereas asking for any transformation - even just a start
 * offset - returns an unoptimised full-size PNG measured at 3.3MB for a 1080p
 * clip, which is a terrible trade for an image shown for a few seconds.
 */
export function deriveHeroPosterUrl(url: string): string | null {
  if (typeof url !== "string" || !url.startsWith("https://")) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const { hostname, pathname } = parsed;

  // Compared as a whole label: a bare endsWith("imagekit.io") would also accept
  // a lookalike host such as evilimagekit.io.
  const isImageKit =
    hostname === IMAGEKIT_HOST || hostname.endsWith(`.${IMAGEKIT_HOST}`);

  if (!isImageKit) {
    return null;
  }

  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  const dot = lastSegment.lastIndexOf(".");

  if (dot === -1) {
    return null;
  }

  if (!VIDEO_EXTENSIONS.has(lastSegment.slice(dot + 1).toLowerCase())) {
    return null;
  }

  return `${url}/ik-thumbnail.jpg`;
}

/**
 * Pure and synchronous so it can be tested without a database. An item whose URL
 * no longer passes validation is dropped rather than rendered, and a poster that
 * would not is cleared: a row stored before a rule changed must never be able to
 * break the homepage.
 */
export function buildHeroSlides(
  items: HeroItemInput[],
  defaultSeconds?: number | null,
): HeroSlide[] {
  const slides: HeroSlide[] = [];

  for (const item of items) {
    if (!isAllowedHeroUrl(item.url)) {
      continue;
    }

    const kind = isHeroItemKind(item.kind) ? item.kind : "image";

    // A poster set in the admin always wins; the derived one only fills the gap
    // so an existing video row with no poster gets a frame without a backfill.
    const storedPoster =
      item.posterUrl && isAllowedHeroUrl(item.posterUrl) ? item.posterUrl : null;

    const posterUrl =
      storedPoster ?? (kind === "video" ? deriveHeroPosterUrl(item.url) : null);

    slides.push({
      id: item.id,
      kind,
      url: item.url,
      altText: item.altText,
      posterUrl,
      seconds: resolveSeconds(item.seconds, defaultSeconds),
    });
  }

  return slides;
}
