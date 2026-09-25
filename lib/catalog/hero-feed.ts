import { getHeroSettings, listHeroItems } from "lib/admin/queries";
import {
  buildHeroSlides,
  resolveSeconds,
  type HeroConfig,
  type HeroRowsResult,
} from "lib/catalog/hero";
import { TAGS } from "lib/constants";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

/**
 * Caches the small curated rows for minutes, under its own tag so an admin save
 * refreshes the hero immediately.
 *
 * The try/catch has to live in here rather than around the call site: an error
 * escaping a "use cache" function surfaces as an unhandled 500 in this Next
 * version even when the caller catches it. newly-released-feed.ts catches in the
 * same place for the same reason. The cost is that a failure is cached as
 * `failed` for the length of the profile, so a deploy that lands before the
 * migration runs shows the fallback slide for a few minutes after the tables
 * appear - which is deliberately better than the alternatives, a blank hero or a
 * 500 on the homepage.
 */
async function loadHeroRows(): Promise<HeroRowsResult> {
  "use cache";
  cacheTag(TAGS.hero);
  cacheLife("minutes");

  try {
    const [items, defaultSeconds] = await Promise.all([
      listHeroItems(),
      getHeroSettings(),
    ]);

    return { status: "ok", items, defaultSeconds };
  } catch (error) {
    console.error(
      "Failed to read the hero; the homepage will show its fallback slide:",
      error,
    );

    return { status: "failed" };
  }
}

/**
 * Uncached wrapper, so the ok/failed distinction is decided per render: an
 * unreadable config falls back to the built-in slide, while a list the admin
 * emptied on purpose hides the hero.
 */
export async function getHero(): Promise<HeroConfig> {
  const rows = await loadHeroRows();

  if (rows.status === "failed") {
    return { status: "failed" };
  }

  return {
    status: "ok",
    slides: buildHeroSlides(rows.items, rows.defaultSeconds),
    defaultSeconds: resolveSeconds(null, rows.defaultSeconds),
  };
}
