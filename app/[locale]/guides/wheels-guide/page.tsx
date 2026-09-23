import GuideAnchorNav from "components/guides/anchor-nav";
import GuideFaq from "components/guides/faq";
import WheelGuideHeroBanner from "components/guides/wheel-guide-banner";
import DiameterSection from "components/wheel-guide/diameter";
import DurometerSection from "components/wheel-guide/durometer";
import IndianRoadsSection from "components/wheel-guide/indian-roads";
import PartsSection from "components/wheel-guide/parts";
import RangeSection from "components/wheel-guide/range";
import ShapeSection from "components/wheel-guide/shape";
import WearSection from "components/wheel-guide/wear";
import Footer from "components/layout/footer";
import { ANCHOR_NAV, WHEEL_FAQ } from "lib/wheel-guide/data";
import { guideMetadata } from "lib/guides/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata(
  "Wheel Guide",
  "What the two numbers printed on a skateboard wheel mean, what the shape does that the numbers cannot tell you, and how to choose for Indian roads.",
);

export default async function WheelsGuidePage() {
  return (
    <>
      <WheelGuideHeroBanner />
      <GuideAnchorNav items={ANCHOR_NAV} />
      <PartsSection />
      <DiameterSection />
      <DurometerSection />
      <ShapeSection />
      <IndianRoadsSection />
      <WearSection />
      <RangeSection />
      <GuideFaq
        items={WHEEL_FAQ}
        idBase="wheel-faq"
        variant="chevron"
        kicker="08 — FAQ"
        title="FAQ"
        stockLabel="What we stock:"
      />
      <Footer />
    </>
  );
}
