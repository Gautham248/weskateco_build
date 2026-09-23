import TruckAnchorNav from "components/truck-guide/anchor-nav";
import BushingsSection from "components/truck-guide/bushings";
import BuildSection from "components/truck-guide/build";
import CareSection from "components/truck-guide/care";
import TruckFaqSection from "components/truck-guide/faq";
import TruckGuideHero from "components/truck-guide/hero";
import HeightSection from "components/truck-guide/height";
import PartsSection from "components/truck-guide/parts";
import RangeSection from "components/truck-guide/range";
import SizeSection from "components/truck-guide/size";
import TurnSection from "components/truck-guide/turn";
import TypesSection from "components/truck-guide/types";
import Footer from "components/layout/footer";
import { TRUCK_HERO } from "lib/truck-guide/data";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Truck Guide | WeSkate Co",
  description: TRUCK_HERO.lede,
  openGraph: {
    type: "website",
  },
};

export default async function TruckGuidePage() {
  return (
    <>
      <TruckGuideHero />
      <TruckAnchorNav />
      <PartsSection />
      <SizeSection />
      <HeightSection />
      <TurnSection />
      <TypesSection />
      <BushingsSection />
      <BuildSection />
      <RangeSection />
      <CareSection />
      <TruckFaqSection />
      <Footer />
    </>
  );
}
