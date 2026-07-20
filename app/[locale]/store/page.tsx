import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import { createTranslator } from "lib/i18n";
import { Suspense } from "react";
import StoreAllClient from "./store-all-client";

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
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch all products server-side; client component handles all filter/sort/pagination
  const products = await getProducts({ sortKey, reverse });

  return (
    <Suspense fallback={null}>
      <StoreAllClient products={products} locale={locale} />
    </Suspense>
  );
}
