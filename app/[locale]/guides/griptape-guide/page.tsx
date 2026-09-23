import GripAnchorNav from "components/griptape-guide/anchor-nav";
import ApplySection from "components/griptape-guide/apply";
import ConditionsSection from "components/griptape-guide/conditions";
import GradesSection from "components/griptape-guide/grades";
import GrainSection from "components/griptape-guide/grain";
import GritSection from "components/griptape-guide/grit";
import GripFaqSection from "components/griptape-guide/faq";
import GripGuideHero from "components/griptape-guide/hero";
import LayersSection from "components/griptape-guide/layers";
import RangeSection from "components/griptape-guide/range";
import WearSection from "components/griptape-guide/wear";
import Footer from "components/layout/footer";
import { GRIP_HERO } from "lib/griptape-guide/data";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Griptape Guide | WeSkate Co",
  description: GRIP_HERO.lede,
  openGraph: {
    type: "website",
  },
};

export default async function GriptapeGuidePage() {
  return (
    <>
      <GripGuideHero />
      <GripAnchorNav />
      <LayersSection />
      <GritSection />
      <GrainSection />
      <GradesSection />
      <ApplySection />
      <ConditionsSection />
      <WearSection />
      <RangeSection />
      <GripFaqSection />
      <Footer />
    </>
  );
}
