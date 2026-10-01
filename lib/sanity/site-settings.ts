// Read-only public Sanity dataset (no token), so this is safe to call from a
// server component. Called from the server Footer wrapper.
import { sanityClient } from "lib/sanity/client";
import { getSiteSettingsQuery } from "lib/sanity/queries";
import type { SocialLinks } from "lib/sanity/types";

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
 */
export async function getSiteSettings(): Promise<{ socialLinks: SocialLinks }> {
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
