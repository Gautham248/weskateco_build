import HeroBanner from "components/home/hero-banner";
import RetreatBanner from "components/home/retreat-banner";
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
import { JsonLd } from "components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "lib/seo/json-ld";
import { SITE_NAME, withPageMetadata } from "lib/seo/metadata";
import { baseUrl } from "lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata("/", (locale) => {
  const t = createTranslator(locale);

  return {
    // Leads with what shoppers search for; brand searches find the site anyway.
    // absolute: skip the layout's "%s | site name" template, already included.
    title: { absolute: t("home.meta_title").replace("{site}", SITE_NAME) },
    description: t("home.meta_description").replace("{site}", SITE_NAME),
  };
});

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = createTranslator(locale);

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(
            SITE_NAME,
            baseUrl,
            `${baseUrl}/icons/weskate-logo.png`,
          ),
          websiteJsonLd(SITE_NAME, baseUrl),
        ]}
      />
      {/* The page's main heading, for search engines and screen readers. The
          hero is visual only, so the heading isn't shown. */}
      <h1 className="sr-only">{t("home.hero_title")}</h1>
      <HeroBanner locale={locale} />
      <RetreatBanner />
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
      <AcademySection locale={locale} />
      <TipsSection variant="page" />
      {/* <ConfiguratorCTA locale={locale} />
      <BrandsSection locale={locale} /> */}
      <Footer />
    </>
  );
}
