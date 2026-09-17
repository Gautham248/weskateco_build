import {
  NewlyReleasedManager,
  type NewlyReleasedManagerItem,
} from "components/admin/newly-released-manager";
import type { AdminProductOverrideSummary } from "lib/admin/product-filters";
import {
  listNewlyReleasedItems,
  listOverridesForHandles,
} from "lib/admin/queries";
import { getAdminProductCatalog, getProduct } from "lib/shopify";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newly Released | WeSkate Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewlyReleasedPage() {
  let initialItems: NewlyReleasedManagerItem[] = [];
  let loadError = false;

  try {
    const rows = await listNewlyReleasedItems();

    const products = await Promise.all(
      rows.map((row) => getProduct(row.productHandle)),
    );

    initialItems = rows.map((row, index) => {
      const product = products[index];

      return {
        productHandle: row.productHandle,
        shopifyProductId: row.shopifyProductId ?? product?.id ?? null,
        cardImageUrl: row.cardImageUrl,
        heroImageUrl: row.heroImageUrl,
        subtitle: row.subtitle,
        title: product?.title ?? row.productHandle,
        vendor: product?.vendor ?? "",
        thumbnailUrl: product?.featuredImage?.url ?? null,
        photos:
          product?.images.map((image) => ({
            url: image.url,
            altText: image.altText,
          })) ?? [],
        photosLoading: false,
      };
    });
  } catch (error) {
    console.error("Could not load the newly released carousel:", error);
    loadError = true;
  }

  const { items: catalog, truncated } = await getAdminProductCatalog();

  let overrides: AdminProductOverrideSummary[] = [];
  let overrideLookupFailed = false;

  try {
    const rows = await listOverridesForHandles(
      catalog.map((item) => item.handle),
    );

    overrides = rows.map((row) => ({
      handle: row.productHandle,
      title: row.title,
    }));
  } catch (error) {
    console.error("Could not load product overrides for the picker:", error);
    overrideLookupFailed = true;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
          Newly Released
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Curate the homepage carousel. Items are real Shopify products —
          nothing is written back to Shopify.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not read the current carousel. Saving now would replace whatever
          is stored with an empty list.
        </p>
      ) : null}

      {overrideLookupFailed ? (
        <p
          role="alert"
          className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          Could not read existing overrides. The Override status filter may be
          wrong for some products.
        </p>
      ) : null}

      <NewlyReleasedManager
        initialItems={initialItems}
        catalog={catalog}
        overrides={overrides}
        truncated={truncated}
      />
    </div>
  );
}
