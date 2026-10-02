import {
  SocialPostsManager,
  type SocialPostManagerItem,
} from "components/admin/social-posts-manager";
import { listSocialPosts } from "lib/admin/queries";
import { normalizePlatform } from "lib/catalog/social-posts";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social Posts | WeSkate Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSocialPostsPage() {
  let items: SocialPostManagerItem[] = [];
  let loadError = false;

  try {
    items = (await listSocialPosts()).map((row) => ({
      id: row.id,
      imageUrl: row.imageUrl,
      altText: row.altText ?? "",
      permalink: row.permalink ?? "",
      platform: normalizePlatform(row.platform),
      isReel: row.isReel,
    }));
  } catch (error) {
    console.error("Could not load the social posts:", error);
    loadError = true;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
          Social Posts
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Curate the social strip on the home page and every store page. Mix
          platforms freely — 4-5 Instagram posts and a couple of LinkedIn ones
          sit side by side, each badged with its own platform, in this order.
          Upload the screenshot rather than pasting a link to it, because social
          CDN URLs expire.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not read the current posts. Saving now would replace whatever is
          stored with what is on screen — which is empty, so that would hide the
          strip entirely.
        </p>
      ) : null}

      <SocialPostsManager initialItems={items} />
    </div>
  );
}
