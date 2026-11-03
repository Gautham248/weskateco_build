import GuideAnchorNav from "components/guides/anchor-nav";
import GuideFaq from "components/guides/faq";
import GuideHero from "components/guides/hero";
import ApplySection from "components/griptape-guide/apply";
import ConditionsSection from "components/griptape-guide/conditions";
import GradesSection from "components/griptape-guide/grades";
import GrainSection from "components/griptape-guide/grain";
import GritSection from "components/griptape-guide/grit";
import LayersSection from "components/griptape-guide/layers";
import RangeSection from "components/griptape-guide/range";
import WearSection from "components/griptape-guide/wear";
import Footer from "components/layout/footer";
import {
  ANCHOR_NAV,
  FAQ_SECTION,
  GRIP_FAQ,
  GRIP_HERO,
} from "lib/griptape-guide/data";
import { guideMetadata } from "lib/guides/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata("Griptape Guide", GRIP_HERO.lede);

export default async function GriptapeGuidePage() {
  return (
    <>
      <GuideHero hero={GRIP_HERO} />
      <GuideAnchorNav items={ANCHOR_NAV} />
      <LayersSection />
      <GritSection />
      <GrainSection />
      <GradesSection />
      <ApplySection />
      <ConditionsSection />
      <WearSection />
      <RangeSection />
      <GuideFaq
        items={GRIP_FAQ}
        idBase="grip-faq"
        variant="plus"
        kicker={FAQ_SECTION.kicker}
        title={FAQ_SECTION.title}
        intro={FAQ_SECTION.intro}
        bg="white"
      />
      <Footer />
    </>
  );
}
