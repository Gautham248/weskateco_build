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
  title: "Store",
  description: "Browse products in the store.",
};

export default async function StorePage(props: {
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
      <div className="mb-6">
        <FilterSortBar
          title={displayTitle}
          totalProducts={filteredProducts.length}
          locale={locale}
          collections={[]}
          activeCollectionHandle=""
        />
      </div>

      {filteredProducts.length > 0 ? (
        <Grid className="grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
          <ProductGridItems products={filteredProducts} locale={locale} />
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
