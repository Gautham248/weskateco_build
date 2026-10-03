import GuideAnchorNav from "components/guides/anchor-nav";
import GuideFaq from "components/guides/faq";
import GuideHero from "components/guides/hero";
import Footer from "components/layout/footer";
import GeometrySection from "components/surfskate-guide/geometry";
import MechanismSection from "components/surfskate-guide/mechanism";
import PumpingSection from "components/surfskate-guide/pumping";
import RangeSection from "components/surfskate-guide/range";
import SpringSection from "components/surfskate-guide/spring";
import SurfingSection from "components/surfskate-guide/surfing";
import WheelsSection from "components/surfskate-guide/wheels";
import { guideMetadata } from "lib/guides/metadata";
import {
  ANCHOR_NAV,
  FAQ_SECTION,
  SURF_FAQ,
  SURFSKATE_HERO,
} from "lib/surfskate-guide/data";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata("Surfskate Guide", SURFSKATE_HERO.lede);

export default function SurfskateGuidePage() {
  return (
    <>
      <GuideHero hero={SURFSKATE_HERO} />
      <GuideAnchorNav items={ANCHOR_NAV} />
      <MechanismSection />
      <PumpingSection />
      <SpringSection />
      <GeometrySection />
      <WheelsSection />
      <SurfingSection />
      <RangeSection />
      <GuideFaq
        items={SURF_FAQ}
        idBase="surfskate-faq"
        variant="plus"
        kicker={FAQ_SECTION.kicker}
        title={FAQ_SECTION.title}
        intro={FAQ_SECTION.intro}
      />
      <Footer />
    </>
  );
}
