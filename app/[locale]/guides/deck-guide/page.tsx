import DeckAnchorNav from "components/deck-guide/anchor-nav";
import CareSection from "components/deck-guide/care";
import ConcaveSection from "components/deck-guide/concave";
import DeckFaqSection from "components/deck-guide/faq";
import FinishSection from "components/deck-guide/finish";
import DeckGuideHero from "components/deck-guide/hero";
import EpoxySection from "components/deck-guide/epoxy";
import MapleSection from "components/deck-guide/maple";
import PliesSection from "components/deck-guide/plies";
import RangeSection from "components/deck-guide/range";
import ShapeSection from "components/deck-guide/shape";
import WearSection from "components/deck-guide/wear";
import Footer from "components/layout/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Deck Guide | WeSkate Co",
  description:
    "The buying guide gets you to a width. This one is about the plank itself — what seven plies of maple actually do, why it is maple and not something else, what moisture does to it, what the glue is holding together in Indian heat, where a deck's numbers are measured from, what concave is in cross-section, and the four ways a deck dies.",
  openGraph: {
    type: "website",
  },
};

export default async function DeckGuidePage() {
  return (
    <>
      <DeckGuideHero />
      <DeckAnchorNav />
      <PliesSection />
      <ShapeSection />
      <MapleSection />
      <EpoxySection />
      <ConcaveSection />
      <FinishSection />
      <WearSection />
      <CareSection />
      <RangeSection />
      <DeckFaqSection />
      <Footer />
    </>
  );
}
