import HeroBanner from "components/home/hero-banner";
import NewlyRelease from "components/home/newly-release";
import AboutSection from "components/home/about-section";
import CategoryGrid from "components/home/category-grid";
import ProductGridSection from "components/home/product-grid-section";
import ShopNow from "components/home/shop-now";
import AcademySection from "components/home/academy-section";
import TipsSection from "components/home/tips-section";
import ConfiguratorCTA from "components/home/configurator-cta";
import BrandsSection from "components/home/brands-section";
import Footer from "components/layout/footer";
import { createTranslator, getLocalizedPath } from "lib/i18n";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  description:
    "High-performance storefront for WeSkate Co, India's Home for Skateboards & Surfskates.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = createTranslator(locale);

  return (
    <>
      <HeroBanner locale={locale} />
      <NewlyRelease locale={locale} />
      <AboutSection />
      <CategoryGrid locale={locale} />
      {/* <ProductGridSection
        title={t("home.featured_products")}
        products={slicedFeaturedProducts}
        locale={locale}
        browseAllLink={getLocalizedPath("/store/skateboard-completes", locale)}
        browseAllLabel={t("home.browse_all")}
      />
      <ProductGridSection
        title={t("home.new_arrivals")}
        products={slicedNewArrivals}
        locale={locale}
      /> */}
      <ShopNow locale={locale} />
      <AcademySection />
      <TipsSection variant="page" />
      {/* <ConfiguratorCTA locale={locale} />
      <BrandsSection locale={locale} /> */}
      <Footer />
    </>
  );
}
