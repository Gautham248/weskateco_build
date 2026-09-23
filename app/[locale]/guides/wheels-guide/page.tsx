import WheelGuideHeroBanner from "components/guides/wheel-guide-banner";
import WheelAnchorNav from "components/wheel-guide/anchor-nav";
import DiameterSection from "components/wheel-guide/diameter";
import DurometerSection from "components/wheel-guide/durometer";
import WheelFaqSection from "components/wheel-guide/faq";
import IndianRoadsSection from "components/wheel-guide/indian-roads";
import PartsSection from "components/wheel-guide/parts";
import RangeSection from "components/wheel-guide/range";
import ShapeSection from "components/wheel-guide/shape";
import WearSection from "components/wheel-guide/wear";
import Footer from "components/layout/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Wheel Guide | WeSkate Co",
  description:
    "What the two numbers printed on a skateboard wheel mean, what the shape does that the numbers cannot tell you, and how to choose for Indian roads.",
  openGraph: {
    type: "website",
  },
};

export default async function WheelsGuidePage() {
  return (
    <>
      <WheelGuideHeroBanner />
      <WheelAnchorNav />
      <PartsSection />
      <DiameterSection />
      <DurometerSection />
      <ShapeSection />
      <IndianRoadsSection />
      <WearSection />
      <RangeSection />
      <WheelFaqSection />
      <Footer />
    </>
  );
}
