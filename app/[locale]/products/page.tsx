import Footer from "components/layout/footer";
import CollectionsGrid from "components/product/collections-grid";
import { createTranslator } from "lib/i18n";
import { getCollections } from "lib/shopify";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Collections",
  description:
    "Browse skateboards, surfskates, completes, apparel, protection gear, portable ramps, and collections from the brands we carry.",
};

export default async function ProductsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const collections = await getCollections();
  const visibleCollections = collections.filter(
    (collection) => collection.handle !== "",
  );
  const t = createTranslator(locale);

  return (
    <>
      <CollectionsGrid
        collections={visibleCollections}
        locale={locale}
        title={t("collection.title")}
        description={t("collection.all_products_description")}
      />
      <Footer />
    </>
  );
}
