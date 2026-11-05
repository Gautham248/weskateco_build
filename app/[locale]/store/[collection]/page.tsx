import { defaultSort, sorting } from "lib/constants";
import { createTranslator, defaultLocale } from "lib/i18n";
import {
  documentTitle,
  localeAlternates,
  openGraph,
  pageQuery,
  SITE_NAME,
  socialTitle,
  summarize,
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
  const collection = await getCollection(params.collection, params.locale);

  if (!collection) return notFound();

  const t = createTranslator(params.locale);
  const title = collection.seo?.title || collection.title;
  // A merchant-written SEO description is used as written
  const description =
    collection.seo?.description ||
    summarize(
      collection.description ||
        t("store.meta_collection_description")
          .replace("{title}", collection.title)
          .replace("{site}", SITE_NAME),
    );
  const path = `/store/${collection.handle}`;
  const query = pageQuery(searchParams?.page);

  return {
    title: documentTitle(title),
    description,
    // Sort and filter params render the same collection, so they're dropped;
    // each page of results keeps its ?page=
    alternates: localeAlternates(path, params.locale, query),
    openGraph: openGraph(params.locale, path + query, {
      title: socialTitle(title),
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

  const [collection, allCollections, localizedCollections, allProducts] =
    await Promise.all([
      getCollection(params.collection, params.locale),
      // English on purpose: the collection pills and filter labels group
      // collections by their English titles (see CATEGORY_PREFIXES).
      getCollections(),
      // …and these are the titles the shopper reads
      params.locale === defaultLocale
        ? undefined
        : getCollections(params.locale),
      getProducts({ locale: params.locale }),
    ]);

  if (!collection) return notFound();

  const t = createTranslator(params.locale);

  return (
    <StoreCollectionClient
      initialCollectionHandle={params.collection}
      allProducts={allProducts}
      allCollections={allCollections}
      localizedCollections={localizedCollections}
      locale={params.locale}
      noProductsText={t("collection.no_products")}
      initialFilters={initialFilters}
      initialSort={sort || ""}
      initialPage={page}
    />
  );
}
