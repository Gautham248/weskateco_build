import GuideAnchorNav from "components/guides/anchor-nav";
import GuideFaq from "components/guides/faq";
import GuideHero from "components/guides/hero";
import CareSection from "components/deck-guide/care";
import ConcaveSection from "components/deck-guide/concave";
import FinishSection from "components/deck-guide/finish";
import EpoxySection from "components/deck-guide/epoxy";
import MapleSection from "components/deck-guide/maple";
import PliesSection from "components/deck-guide/plies";
import RangeSection from "components/deck-guide/range";
import ShapeSection from "components/deck-guide/shape";
import WearSection from "components/deck-guide/wear";
import Footer from "components/layout/footer";
import {
  ANCHOR_NAV,
  DECK_FAQ,
  DECK_HERO,
  FAQ_SECTION,
} from "lib/deck-guide/data";
import { guideMetadata } from "lib/guides/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata(
  "Deck Guide",
  "The buying guide gets you to a width. This one is about the plank itself — what seven plies of maple actually do, why it is maple and not something else, what moisture does to it, what the glue is holding together in Indian heat, where a deck's numbers are measured from, what concave is in cross-section, and the four ways a deck dies.",
);

export default async function DeckGuidePage() {
  return (
    <>
      <GuideHero hero={DECK_HERO} />
      <GuideAnchorNav items={ANCHOR_NAV} />
      <PliesSection />
      <ShapeSection />
      <MapleSection />
      <EpoxySection />
      <ConcaveSection />
      <FinishSection />
      <WearSection />
      <CareSection />
      <RangeSection />
      <GuideFaq
        items={DECK_FAQ}
        idBase="deck-faq"
        variant="chevron"
        kicker={FAQ_SECTION.kicker}
        title={FAQ_SECTION.title}
        intro={FAQ_SECTION.intro}
      />
      <Footer />
    </>
  );
}
