import { AdminProductsBrowser } from "components/admin/admin-products-browser";
import type { AdminProductOverrideSummary } from "lib/admin/product-filters";
import { listOverridesForHandles } from "lib/admin/queries";
import { getAdminProductCatalog } from "lib/shopify";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | WeSkate Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const { items, truncated } = await getAdminProductCatalog();

  let overrides: AdminProductOverrideSummary[] = [];
  let overrideLookupFailed = false;

  try {
    const rows = await listOverridesForHandles(
      items.map((item) => item.handle),
    );
    overrides = rows.map((row) => ({
      handle: row.productHandle,
      title: row.title,
    }));
  } catch (error) {
    console.error("Could not load product overrides for the list:", error);
    overrideLookupFailed = true;
  }

  const overridden = overrides.length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
            Products
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Override photos, descriptions and titles. Shopify is never modified.
          </p>
        </div>

        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {overridden} override{overridden === 1 ? "" : "s"} across the catalog
        </span>
      </header>

      {overrideLookupFailed ? (
        <p
          role="alert"
          className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          Could not read existing overrides. Products are listed from Shopify,
          but the Overridden badges may be missing.
        </p>
      ) : null}

      <AdminProductsBrowser
        products={items}
        overrides={overrides}
        truncated={truncated}
      />
    </div>
  );
}
