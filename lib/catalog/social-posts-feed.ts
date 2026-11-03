import "server-only";

import { listSocialPosts, type SocialPostRow } from "lib/admin/queries";
import {
  buildSocialPosts,
  type SocialPostCard,
} from "lib/catalog/social-posts";
import { TAGS } from "lib/constants";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

/**
 * What the storefront is handed.
 *
 * `failed` is deliberately distinct from an empty `ok`: an unreadable config (a
 * database blip, or a deploy that landed before the migration ran) must fall
 * back to the legacy screenshots, whereas a list the admin emptied on purpose
 * hides the section. Collapsing the two would mean a transient database error
 * silently emptied the strip on every page that renders it.
 */
export type SocialPostsConfig =
  | { status: "ok"; posts: SocialPostCard[] }
  | { status: "failed" };

/**
 * Caches the small curated rows for minutes, under its own tag so an admin save
 * refreshes the strip immediately.
 *
 * The try/catch has to live in here rather than around the call site: an error
 * escaping a "use cache" function surfaces as an unhandled 500 in this Next
 * version even when the caller catches it. hero-feed.ts catches in the same
 * place for the same reason.
 */
async function loadSocialPostRows(): Promise<
  { status: "ok"; rows: SocialPostRow[] } | { status: "failed" }
> {
  "use cache";
  cacheTag(TAGS.socialPosts);
  cacheLife("minutes");

  try {
    return { status: "ok", rows: await listSocialPosts() };
  } catch (error) {
    console.error(
      "Failed to read the social posts; the strip will show its fallback images:",
      error,
    );

    return { status: "failed" };
  }
}

/**
 * Uncached wrapper, so the ok/failed distinction is decided per render rather
 * than being pinned into the cache by whichever one happened first.
 */
export async function getSocialPosts(): Promise<SocialPostsConfig> {
  const rows = await loadSocialPostRows();

  if (rows.status === "failed") {
    return { status: "failed" };
  }

  return { status: "ok", posts: buildSocialPosts(rows.rows) };
}
