import { defaultSort, sorting } from "lib/constants";
import { getProducts, getCollections } from "lib/shopify";
import { createTranslator } from "lib/i18n";
import { Suspense } from "react";
import StoreCollectionClient from "./[collection]/store-collection-client";

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

  const { sort } = (searchParams || {}) as { [key: string]: string };
  const page = Number(searchParams?.page) || 1;

  const initialFilters: Record<string, string> = {};
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "sort" && key !== "page" && key !== "filter" && typeof value === "string") {
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
