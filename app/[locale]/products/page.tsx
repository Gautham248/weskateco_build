import Footer from "components/layout/footer";
import CollectionsGrid from "components/product/collections-grid";
import { createTranslator } from "lib/i18n";
import { getCollections } from "lib/shopify";
import { withPageMetadata } from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata("/products", (locale) => {
  const t = createTranslator(locale);

  return {
    title: t("collection.title"),
    description: t("product.collections_meta_description"),
  };
});

export default async function ProductsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const collections = await getCollections(locale);
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
