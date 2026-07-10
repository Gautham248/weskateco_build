import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts, getCollections } from "lib/shopify";
import Link from "next/link";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import FilterSortBar from "components/layout/search/filter-sort-bar";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { locale } = await props.params;
  const { sort, color, level, price, q: searchValue } = (searchParams || {}) as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [products, collections] = await Promise.all([
    getProducts({ sortKey, reverse, query: searchValue }),
    getCollections(),
  ]);

  // Apply filters
  let filteredProducts = [...products];

  if (color) {
    const colorLower = color.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesOption = product.options?.some((opt) =>
        opt.name.toLowerCase() === "color" &&
        opt.values.some((val) => val.toLowerCase() === colorLower)
      );
      const matchesTag = product.tags?.some((tag) => tag.toLowerCase() === colorLower);
      const matchesTitle = product.title.toLowerCase().includes(colorLower);
      const matchesDesc = product.description?.toLowerCase().includes(colorLower);
      return matchesOption || matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (level) {
    const levelLower = level.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesTag = product.tags?.some((tag) => tag.toLowerCase() === levelLower);
      const matchesTitle = product.title.toLowerCase().includes(levelLower);
      const matchesDesc = product.description?.toLowerCase().includes(levelLower);
      return matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (price) {
    const [minPrice, maxPrice] = price.split("-").map(Number);
    if (minPrice !== undefined && maxPrice !== undefined && !isNaN(minPrice) && !isNaN(maxPrice)) {
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = Number(product.priceRange.minVariantPrice.amount);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }
  }

  const resultsText = filteredProducts.length > 1 ? "results" : "result";
  const t = createTranslator(locale);

  // Filter out the empty handle/All collection for the grid since we show "All Products" below
  const filteredCollections = collections.filter((c) => c.handle !== "");

  const formattedCollections = collections.map(c => ({
    handle: c.handle,
    title: c.title,
    path: c.path
  }));

  const displayTitle = searchValue ? `Search: ${searchValue}` : t("collection.all_products");

  return (
    <>
      {/* Collection Grid at the top - show only when not searching */}
      {!searchValue && filteredCollections.length > 0 && (
        <div className="mb-12 border-b border-neutral-100 pb-10 dark:border-neutral-800">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t("collection.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredCollections.map((collection) => (
              <Link
                key={collection.handle}
                href={getLocalizedPath(collection.path, locale)}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
              >
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {collection.title}
                </span>
                {collection.description && (
                  <span className="mt-1 text-xs text-neutral-500 line-clamp-1 dark:text-neutral-400">
                    {collection.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <FilterSortBar
          title={displayTitle}
          totalProducts={filteredProducts.length}
          locale={locale}
          collections={formattedCollections}
          activeCollectionHandle=""
        />
      </div>

      {filteredProducts.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={filteredProducts} />
        </Grid>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No products found
          </p>
        </div>
      )}
    </>
  );
}
