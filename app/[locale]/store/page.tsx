import { defaultSort, sorting } from "lib/constants";
import { getProducts, getCollections } from "lib/shopify";
import { createTranslator } from "lib/i18n";
import { Suspense } from "react";
import StoreCollectionClient from "./[collection]/store-collection-client";
import { SITE_NAME, withPageMetadata } from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata(
  "/store",
  {
    title: "Store",
    description: `Shop skateboards, surfskates, protective gear and apparel at ${SITE_NAME}.`,
  },
  { paginated: true },
);

export default async function StorePage(props: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { locale } = await props.params;

  const { sort } = (searchParams || {}) as { [key: string]: string };
  const page = Number(searchParams?.page) || 1;

  const initialFilters: Record<string, string> = {};
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (
        key !== "sort" &&
        key !== "page" &&
        key !== "filter" &&
        typeof value === "string"
      ) {
        initialFilters[key] = value;
      }
    });
  }

  const [allProducts, allCollections] = await Promise.all([
    getProducts({}),
    getCollections(),
  ]);

  const t = createTranslator(locale);

  return (
    <Suspense fallback={null}>
      <StoreCollectionClient
        initialCollectionHandle=""
        allProducts={allProducts}
        allCollections={allCollections}
        locale={locale}
        noProductsText={t("collection.no_products")}
        initialFilters={initialFilters}
        initialSort={sort || ""}
        initialPage={page}
      />
    </Suspense>
  );
}
