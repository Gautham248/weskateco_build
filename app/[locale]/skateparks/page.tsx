import Footer from "components/layout/footer";
import SkateparkHeroBanner from "components/skatepark/hero-banner";
import OurMissionSection from "components/skatepark/our-mission";
import OurServicesSection from "components/skatepark/our-services";
import SkateparkGallerySection from "components/skatepark/skatepark-gallery";
import WhyChooseUsSection from "components/skatepark/why-choose-us";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "WB Skateparks | WeSkate Co",
  description:
    "From Bangalore and Kerala, WB Skateparks brings together riders and builders to create raw, purpose-built concrete skateparks.",
  openGraph: {
    type: "website",
  },
};

export default async function SkateparksPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <>
      <SkateparkHeroBanner locale={locale} />
      <OurMissionSection />
      <WhyChooseUsSection />
      <OurServicesSection />
      <SkateparkGallerySection />
      <Footer />
    </>
  );
}
