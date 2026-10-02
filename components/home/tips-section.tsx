import TipsCarousel from "components/home/tips-carousel";
import tip1 from "components/icons/tip1.png";
import tip2 from "components/icons/tip2.png";
import tip3 from "components/icons/tip3.png";
import tip4 from "components/icons/tip4.png";
import tip5 from "components/icons/tip5.png";
import { getSocialPosts } from "lib/catalog/social-posts-feed";
import type { SocialPostCard } from "lib/catalog/social-posts";
import type { StaticImageData } from "next/image";

/**
 * The community strip: Instagram posts curated from the admin panel.
 *
 * These screenshots are the section's original content, kept only as an error
 * fallback. They were committed on 2026-07-10 and never updated, which is what
 * made the section look permanently stale. They are no longer reachable in
 * normal operation — an admin-curated list, including an empty one, always
 * takes precedence over them.
 */
const FALLBACK_POSTS: SocialPostCard[] = [
  fallbackPost("legacy-1", tip1),
  fallbackPost("legacy-2", tip2),
  fallbackPost("legacy-3", tip3),
  fallbackPost("legacy-4", tip4),
  fallbackPost("legacy-5", tip5),
];

/** Next's static image import is an object, not a URL string. */
function fallbackPost(
  id: string,
  image: StaticImageData | string,
): SocialPostCard {
  return {
    id,
    imageUrl: typeof image === "string" ? image : image.src,
    altText: null,
    // The originals had no recorded source post, so there is nothing truthful
    // to link to. These cards render their button inert.
    permalink: null,
    platform: "instagram",
    isReel: false,
  };
}

export default async function TipsSection({
  variant = "default",
}: {
  variant?: "default" | "page";
}) {
  const config = await getSocialPosts();

  // A read failure falls back to the legacy screenshots, so a database blip
  // degrades the section rather than emptying it.
  if (config.status === "failed") {
    return <TipsCarousel posts={FALLBACK_POSTS} variant={variant} />;
  }

  /**
   * An empty curated list is a deliberate state, not a failure: the admin
   * removed the posts, so the section is hidden rather than padding the page
   * with five screenshots nobody asked for. Rendering the fallback here instead
   * is what made this section impossible to switch off.
   */
  if (config.posts.length === 0) {
    return null;
  }

  return <TipsCarousel posts={config.posts} variant={variant} />;
}
