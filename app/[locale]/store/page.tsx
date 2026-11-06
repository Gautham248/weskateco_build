import { defaultSort, sorting } from "lib/constants";
import { getProducts, getCollections } from "lib/shopify";
import { createTranslator, defaultLocale } from "lib/i18n";
import StoreCollectionClient from "./[collection]/store-collection-client";
import { SITE_NAME, withPageMetadata } from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata(
  "/store",
  (locale) => {
    const t = createTranslator(locale);

    return {
      title: t("store.store"),
      description: t("store.meta_description").replace("{site}", SITE_NAME),
    };
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

  const [allProducts, allCollections, localizedCollections] = await Promise.all(
    [
      getProducts({ locale }),
      // English on purpose: the collection pills and filter labels group
      // collections by their English titles (see CATEGORY_PREFIXES).
      getCollections(),
      // …and these are the titles the shopper reads
      locale === defaultLocale ? undefined : getCollections(locale),
    ],
  );

  const t = createTranslator(locale);

  return (
    <StoreCollectionClient
      initialCollectionHandle=""
      allProducts={allProducts}
      allCollections={allCollections}
      localizedCollections={localizedCollections}
      locale={locale}
      noProductsText={t("collection.no_products")}
      initialFilters={initialFilters}
      initialSort={sort || ""}
      initialPage={page}
    />
  );
}
