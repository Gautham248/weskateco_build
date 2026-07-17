import StoreBanner from "components/layout/search/banner";
import FilterSortBar from "components/layout/search/filter-sort-bar";
import ProductCard from "components/product/product-card";
import { defaultSort, sorting } from "lib/constants";
import { createTranslator } from "lib/i18n";
import {
  getCollection,
  getCollectionProducts,
  getCollections,
} from "lib/shopify";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, color, level, price, page } = (searchParams || {}) as {
    [key: string]: string;
  };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [collection, products, collections] = await Promise.all([
    getCollection(params.collection),
    getCollectionProducts({
      collection: params.collection,
      sortKey,
      reverse,
    }),
    getCollections(),
  ]);

  if (!collection) return notFound();

  // Apply filters
  let filteredProducts = [...products];

  if (color) {
    const colorLower = color.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesOption = product.options?.some(
        (opt) =>
          opt.name.toLowerCase() === "color" &&
          opt.values.some((val) => val.toLowerCase() === colorLower),
      );
      const matchesTag = product.tags?.some(
        (tag) => tag.toLowerCase() === colorLower,
      );
      const matchesTitle = product.title.toLowerCase().includes(colorLower);
      const matchesDesc = product.description
        ?.toLowerCase()
        .includes(colorLower);
      return matchesOption || matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (level) {
    const levelLower = level.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesTag = product.tags?.some(
        (tag) => tag.toLowerCase() === levelLower,
      );
      const matchesTitle = product.title.toLowerCase().includes(levelLower);
      const matchesDesc = product.description
        ?.toLowerCase()
        .includes(levelLower);
      return matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (price) {
    const parts = price.split("-").map(Number);
    const minPrice = parts[0];
    const maxPrice = parts[1];
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      !isNaN(minPrice) &&
      !isNaN(maxPrice)
    ) {
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = Number(product.priceRange.minVariantPrice.amount);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }
  }

  // Pagination calculations
  const ITEMS_PER_PAGE = 12;
  const currentPage = Number(page) || 1;
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const createPageUrl = (pageNumber: number) => {
    const paramsObj = new URLSearchParams();
    if (sort) paramsObj.set("sort", sort);
    if (color) paramsObj.set("color", color);
    if (level) paramsObj.set("level", level);
    if (price) paramsObj.set("price", price);
    paramsObj.set("page", String(pageNumber));
    return `?${paramsObj.toString()}`;
  };

  const getPagesArray = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  };

  const t = createTranslator(params.locale);

  // Mapping of subcollection handles to their main category handle
  const SUB_TO_PARENT: Record<string, string> = {
    // Skateboards
    skateboards: "skateboards",
    decks: "skateboards",
    trucks: "skateboards",
    wheels: "skateboards",
    completes: "skateboards",
    accessories: "skateboards",
    "skateboard-completes": "skateboards",
    "skateboard-decks": "skateboards",
    "skateboard-trucks": "skateboards",
    "skateboard-wheels": "skateboards",
    "skateboard-accessories": "skateboards",

    // Surfskates
    surfskates: "surfskates",
    "surfskate-completes": "surfskates",
    "surfskate-decks": "surfskates",
    "surfskate-trucks": "surfskates",
    "surfskate-wheels": "surfskates",
    "surfskate-accessories": "surfskates",

    // Apparel
    "apparel-1": "apparel-1",
    apparel: "apparel-1",

    // Protection Gears
    "protection-gears": "protection-gears",
    "protective-gears": "protection-gears",
    helmets: "protection-gears",
    pads: "protection-gears",
    gloves: "protection-gears",
  };

  const CATEGORY_PREFIXES: Record<string, string> = {
    skateboards: "skateboard",
    surfskates: "surfskate",
    "apparel-1": "apparel",
    "protection-gears": "protection",
  };

  const activeHandle = params.collection;

  // Resolve parent category
  let parentCategory = SUB_TO_PARENT[activeHandle];
  if (!parentCategory && activeHandle) {
    const handleLower = activeHandle.toLowerCase();
    if (handleLower.includes("skateboard")) {
      parentCategory = "skateboards";
    } else if (handleLower.includes("surfskate")) {
      parentCategory = "surfskates";
    } else if (handleLower.includes("apparel")) {
      parentCategory = "apparel-1";
    } else if (
      handleLower.includes("protect") ||
      handleLower.includes("helmet") ||
      handleLower.includes("pad")
    ) {
      parentCategory = "protection-gears";
    }
  }

  let filteredCollections = collections;

  if (parentCategory) {
    const prefix = CATEGORY_PREFIXES[parentCategory];
    if (prefix) {
      filteredCollections = collections.filter((c) =>
        c.title.toLowerCase().startsWith(prefix),
      );
    }
  } else if (activeHandle !== "") {
    // If it's a brand page (not in SUB_TO_PARENT, and not empty), filter to only show brand collections
    filteredCollections = collections.filter((c) => {
      if (c.handle === "") return false;
      return !SUB_TO_PARENT[c.handle];
    });
  }

  const prefix = parentCategory ? CATEGORY_PREFIXES[parentCategory] : null;

  const formattedCollections = filteredCollections
    .filter((c) => {
      const titleLower = c.title.toLowerCase();
      const handleLower = c.handle.toLowerCase();
      // Don't show the global/all-store "All" pill here
      if (c.handle === "") return false;
      // Don't show surfboard full-setups
      if (
        titleLower === "skateboard and surfskate full-setups" ||
        handleLower === "surfboard full-setups"
      )
        return false;
      return true;
    })
    .map((c) => {
      let displayTitle = c.title;
      const isSameAsNav =
        displayTitle.toLowerCase() === activeHandle.toLowerCase() ||
        (prefix && displayTitle.toLowerCase() === prefix + "s");

      if (isSameAsNav) {
        displayTitle = "All";
      } else if (prefix) {
        const regex = new RegExp(`^(${prefix}s?)\\s+`, "i");
        displayTitle = displayTitle.replace(regex, "");
      }
      return {
        handle: c.handle,
        title: displayTitle,
        path: c.path,
      };
    })
    .sort((a, b) => {
      if (a.title === "All") return -1;
      if (b.title === "All") return 1;
      return 0;
    });

  return (
    <section className="w-full">
      <StoreBanner
        title={collection.title}
        description={collection.description}
      />

      <div className="mb-6">
        <FilterSortBar
          title={collection.title}
          totalProducts={filteredProducts.length}
          locale={params.locale}
          collections={formattedCollections}
          activeCollectionHandle={params.collection}
        />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            {t("collection.no_products")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.handle}
                product={product}
                locale={params.locale}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 py-4">
              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors mr-2"
                >
                  &lt; Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-neutral-400 dark:text-neutral-700 cursor-not-allowed mr-2">
                  &lt; Previous
                </span>
              )}

              <div className="flex items-center gap-1">
                {getPagesArray(currentPage, totalPages).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`ellipse-${idx}`}
                        className="px-2 text-neutral-400 dark:text-neutral-600"
                      >
                        ...
                      </span>
                    );
                  }

                  const isCurrent = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={createPageUrl(Number(p))}
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-all ${
                        isCurrent
                          ? "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(currentPage + 1)}
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors ml-2"
                >
                  Next &gt;
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-neutral-400 dark:text-neutral-700 cursor-not-allowed ml-2">
                  Next &gt;
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
