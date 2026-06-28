import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "components/product/product-card";
import { defaultSort, sorting } from "lib/constants";
import { createTranslator } from "lib/i18n";

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
  const { sort } = (searchParams || {}) as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [collection, products] = await Promise.all([
    getCollection(params.collection),
    getCollectionProducts({
      collection: params.collection,
      sortKey,
      reverse,
    }),
  ]);

  if (!collection) return notFound();

  const t = createTranslator(params.locale);

  return (
    <section className="w-full">
      <div className="mb-8 border-b border-neutral-100 pb-6 dark:border-neutral-800">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 max-w-3xl text-sm text-neutral-500 dark:text-neutral-400">
            {collection.description}
          </p>
        )}
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {products.length} {t("collection.products_count")}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            {t("collection.no_products")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.handle}
              product={product}
              locale={params.locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}
