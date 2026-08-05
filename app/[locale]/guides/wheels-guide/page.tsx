import ChoosingAWheelShapeSection from "components/guides/choosing-a-wheel-shape";
import NarrowOrWideContactPatchSection from "components/guides/narrow-or-wide-contact-patch";
import WheelDurometerSection from "components/guides/wheel-durometer";
import WheelGuideHeroBanner from "components/guides/wheel-guide-banner";
import WhatsTheRightWheelSizeSection from "components/guides/whats-the-right-wheel-size";
import WhereShouldYouStartSection from "components/guides/where-should-you-start";
import Footer from "components/layout/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Wheels Guide | WeSkate Co",
  description: "Comprehensive guide to choosing the right skateboard wheels.",
  openGraph: {
    type: "website",
  },
};

export default async function WheelsGuidePage() {
  return (
    <>
      <WheelGuideHeroBanner />
      <WhatsTheRightWheelSizeSection />
      <WheelDurometerSection />
      <ChoosingAWheelShapeSection />
      <NarrowOrWideContactPatchSection />
      <WhereShouldYouStartSection />
      <Footer />
    </>
  );
}
