// Read-only public Sanity dataset (no token), so this is safe to call from a
// server component. Called from the server Footer wrapper.
import { TAGS } from "lib/constants";
import { sanityClient } from "lib/sanity/client";
import { getSiteSettingsQuery } from "lib/sanity/queries";
import type { SocialLinks } from "lib/sanity/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

/**
 * Site-wide settings from Sanity, used for the footer's social icons.
 *
 * The handles are already filled in on the `siteSettings` document — they were
 * simply never read by the storefront, which hardcoded bare platform URLs such
 * as `https://instagram.com` instead. That sent people to each platform's own
 * homepage rather than to the brand's profile.
 *
 * A read failure returns empty values so the caller falls back to the built-in
 * defaults rather than failing the page.
 *
 * Cached for minutes under its own tag, matching hero-feed.ts and the other
 * storefront reads: the footer renders on nearly every page, so an uncached read
 * would hit Sanity on every render. The tradeoff is that a failure is cached as
 * empty for the profile's lifetime — the same one hero-feed.ts accepts.
 */
export async function getSiteSettings(): Promise<{ socialLinks: SocialLinks }> {
  "use cache";
  cacheTag(TAGS.siteSettings);
  cacheLife("minutes");

  try {
    const settings = await sanityClient.fetch<{
      socialLinks: SocialLinks | null;
    } | null>(getSiteSettingsQuery);

    return { socialLinks: settings?.socialLinks ?? {} };
  } catch (error) {
    console.error("Could not read site settings from Sanity:", error);
    return { socialLinks: {} };
  }
}
