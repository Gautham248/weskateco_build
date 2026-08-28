import HeroBanner from "components/home/hero-banner";
import NewlyRelease from "components/home/newly-release";
import AboutSection from "components/home/about-section";
import CategoryGridWrapper from "components/home/category-grid-wrapper";
import ShopNowWrapper from "components/home/shop-now-wrapper";
import AcademySection from "components/home/academy-section";
import TipsSection from "components/home/tips-section";
import BrandsSection from "components/home/brands-section";
import Footer from "components/layout/footer";

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

  return (
    <>
      <HeroBanner locale={locale} />
      <NewlyRelease />
      <AboutSection />
      <CategoryGridWrapper locale={locale} />
      <ShopNowWrapper locale={locale} />
      <AcademySection />
      <TipsSection variant="page" />
      <BrandsSection locale={locale} />
      <Footer />
    </>
  );
}
