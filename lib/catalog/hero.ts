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

    const posterUrl =
      item.posterUrl && isAllowedHeroUrl(item.posterUrl)
        ? item.posterUrl
        : null;

    slides.push({
      id: item.id,
      kind: isHeroItemKind(item.kind) ? item.kind : "image",
      url: item.url,
      altText: item.altText,
      posterUrl,
      seconds: resolveSeconds(item.seconds, defaultSeconds),
    });
  }

  return slides;
}
