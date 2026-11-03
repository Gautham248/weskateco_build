import {
  HeroManager,
  type HeroManagerItem,
} from "components/admin/hero-manager";
import { getHeroSettings, listHeroItems } from "lib/admin/queries";
import { isHeroItemKind, resolveSeconds } from "lib/catalog/hero";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hero | WeSkate Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHeroPage() {
  let items: HeroManagerItem[] = [];
  let defaultSeconds = resolveSeconds(null, null);
  let loadError = false;

  try {
    const [rows, storedDefault] = await Promise.all([
      listHeroItems(),
      getHeroSettings(),
    ]);

    items = rows.map((row) => ({
      id: row.id,
      kind: isHeroItemKind(row.kind) ? row.kind : "image",
      url: row.url,
      altText: row.altText ?? "",
      posterUrl: row.posterUrl ?? "",
      seconds: row.seconds === null ? "" : String(row.seconds),
    }));

    defaultSeconds = resolveSeconds(null, storedDefault);
  } catch (error) {
    console.error("Could not load the hero:", error);
    loadError = true;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
          Hero
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Curate the homepage hero. Slides rotate in the order below, each for
          its own duration — nothing is written back to Shopify.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not read the current hero. Saving now would replace whatever is
          stored with what is on screen — and the homepage is showing its
          fallback slide until this loads.
        </p>
      ) : null}

      <HeroManager
        initialItems={items}
        initialDefaultSeconds={defaultSeconds}
      />
    </div>
  );
}
