import AcademyHeroBanner from "components/academy/hero-banner";
// import LovedByCommunity from "components/academy/loved-by-community";
import PhilosophySection from "components/academy/philosophy-section";
import Footer from "components/layout/footer";
import { withPageMetadata } from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata("/academy", {
  title: "WeSkate Academy",
  description: "Learn skateboarding and surfskating with WeSkate Academy.",
  openGraph: {
    type: "website",
  },
});

export default function AcademyPage() {
  return (
    <>
      <AcademyHeroBanner />
      <PhilosophySection />
      {/* <LovedByCommunity /> */}
      <Footer />
    </>
  );
}
