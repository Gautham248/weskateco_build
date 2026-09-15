import { ProductTable } from "components/admin/product-table";
import {
  listOverridesForHandles,
  type ProductOverrideWithImages,
} from "lib/admin/queries";
import { getAdminProductPage } from "lib/shopify";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | WeSkate Admin",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 24;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; q?: string }>;
}) {
  const { after, q } = await searchParams;

  const page = await getAdminProductPage({
    first: PAGE_SIZE,
    after,
    query: q,
  });

  let overridesByHandle = new Map<string, ProductOverrideWithImages>();
  let overrideLookupFailed = false;

  if (page.items.length > 0) {
    try {
      const overrides = await listOverridesForHandles(
        page.items.map((item) => item.handle),
      );
      overridesByHandle = new Map(
        overrides.map((override) => [override.productHandle, override]),
      );
    } catch (error) {
      console.error("Could not load product overrides for the list:", error);
      overrideLookupFailed = true;
    }
  }

  const nextHref = page.endCursor
    ? `/admin/products?after=${encodeURIComponent(page.endCursor)}${
        q ? `&q=${encodeURIComponent(q)}` : ""
      }`
    : null;

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
          {overridesByHandle.size} override
          {overridesByHandle.size === 1 ? "" : "s"} on this page
        </span>
      </header>

      <form
        method="get"
        action="/admin/products"
        className="flex max-w-md gap-2"
      >
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search products…"
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-sm border border-black bg-black px-5 text-xs font-bold tracking-wider text-white uppercase dark:border-white dark:bg-white dark:text-black"
        >
          Search
        </button>
      </form>

      {overrideLookupFailed ? (
        <p
          role="alert"
          className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          Could not read existing overrides. Products are listed from Shopify,
          but the Overridden badges may be missing.
        </p>
      ) : null}

      {page.items.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No products found. If Shopify credentials are not configured, the
          admin product list will be empty.
        </p>
      ) : (
        <ProductTable
          products={page.items}
          overridesByHandle={overridesByHandle}
        />
      )}

      <div className="flex items-center gap-4">
        {after ? (
          <Link
            href={`/admin/products${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className="text-sm underline underline-offset-4"
          >
            ← Back to first page
          </Link>
        ) : null}

        {nextHref ? (
          <Link
            href={nextHref}
            className="text-sm font-semibold underline underline-offset-4"
          >
            Next page →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
