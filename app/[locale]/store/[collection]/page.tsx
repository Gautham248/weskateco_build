import { defaultSort, sorting } from "lib/constants";
import { createTranslator } from "lib/i18n";
import {
  localeAlternates,
  openGraph,
  pageQuery,
  SITE_NAME,
} from "lib/seo/metadata";
import { getCollection, getCollections, getProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import StoreCollectionClient from "./store-collection-client";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  const title = collection.seo?.title || collection.title;
  const description =
    collection.seo?.description ||
    collection.description ||
    `Shop ${collection.title} at ${SITE_NAME}.`;
  const path = `/store/${collection.handle}`;
  const query = pageQuery(searchParams?.page);

  return {
    title,
    description,
    // Sort and filter params render the same collection, so they're dropped;
    // each page of results keeps its ?page=
    alternates: localeAlternates(path, params.locale, query),
    openGraph: openGraph(params.locale, path + query, {
      title: `${title} | ${SITE_NAME}`,
      description,
    }),
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { sort } = (searchParams || {}) as {
    [key: string]: string;
  };
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

  const [collection, allCollections, allProducts] = await Promise.all([
    getCollection(params.collection),
    getCollections(),
    getProducts({}),
  ]);

  if (!collection) return notFound();

  const t = createTranslator(params.locale);

  return (
    <StoreCollectionClient
      initialCollectionHandle={params.collection}
      allProducts={allProducts}
      allCollections={allCollections}
      locale={params.locale}
      noProductsText={t("collection.no_products")}
      initialFilters={initialFilters}
      initialSort={sort || ""}
      initialPage={page}
    />
  );
}
