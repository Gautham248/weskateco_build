import GuideAnchorNav from "components/guides/anchor-nav";
import GuideFaq from "components/guides/faq";
import GuideHero from "components/guides/hero";
import BushingsSection from "components/truck-guide/bushings";
import BuildSection from "components/truck-guide/build";
import CareSection from "components/truck-guide/care";
import HeightSection from "components/truck-guide/height";
import PartsSection from "components/truck-guide/parts";
import RangeSection from "components/truck-guide/range";
import SizeSection from "components/truck-guide/size";
import TurnSection from "components/truck-guide/turn";
import TypesSection from "components/truck-guide/types";
import Footer from "components/layout/footer";
import {
  ANCHOR_NAV,
  FAQ_SECTION,
  TRUCK_FAQ,
  TRUCK_HERO,
} from "lib/truck-guide/data";
import { guideMetadata } from "lib/guides/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata("Truck Guide", TRUCK_HERO.lede);

export default async function TruckGuidePage() {
  return (
    <>
      <GuideHero hero={TRUCK_HERO} />
      <GuideAnchorNav items={ANCHOR_NAV} />
      <PartsSection />
      <SizeSection />
      <HeightSection />
      <TurnSection />
      <TypesSection />
      <BushingsSection />
      <BuildSection />
      <RangeSection />
      <CareSection />
      <GuideFaq
        items={TRUCK_FAQ}
        idBase="truck-faq"
        variant="chevron"
        kicker={FAQ_SECTION.kicker}
        title={FAQ_SECTION.title}
        intro={FAQ_SECTION.intro}
      />
      <Footer />
    </>
  );
}
