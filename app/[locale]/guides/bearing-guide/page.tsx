import GuideAnchorNav from "components/guides/anchor-nav";
import GuideHero from "components/guides/hero";
import Footer from "components/layout/footer";
import { guideMetadata } from "lib/guides/metadata";
import {
  ANCHOR_NAV,
  BEARING_FOOTER,
  BEARING_HERO,
  BEARING_SECTIONS,
} from "lib/bearing-guide/data";
import {
  AbecSection,
  CleanSection,
  FaqSection,
  MaterialsSection,
  PartsSection,
  RangeSection,
  SealsSection,
  StackSection,
  WearSection,
} from "components/bearing-guide/sections";
import { RelatedColumnsAndNote } from "components/bearing-guide/bits";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = guideMetadata("Bearing Guide", BEARING_HERO.lede);

export default async function BearingGuidePage() {
  const partsSec = BEARING_SECTIONS.find((s) => s.id === "parts")!;
  const abecSec = BEARING_SECTIONS.find((s) => s.id === "abec")!;
  const matSec = BEARING_SECTIONS.find((s) => s.id === "mat")!;
  const sealsSec = BEARING_SECTIONS.find((s) => s.id === "seals")!;
  const stackSec = BEARING_SECTIONS.find((s) => s.id === "stack")!;
  const cleanSec = BEARING_SECTIONS.find((s) => s.id === "clean")!;
  const wearSec = BEARING_SECTIONS.find((s) => s.id === "wear")!;
  const rangeSec = BEARING_SECTIONS.find((s) => s.id === "range")!;
  const faqSec = BEARING_SECTIONS.find((s) => s.id === "faq")!;

  return (
    <>
      <GuideHero hero={BEARING_HERO} />
      <GuideAnchorNav items={ANCHOR_NAV} className="hidden md:block" />
      <PartsSection head={partsSec.head} blocks={partsSec.blocks as any} />
      <AbecSection head={abecSec.head} blocks={abecSec.blocks as any} />
      <MaterialsSection head={matSec.head} blocks={matSec.blocks as any} />
      <SealsSection head={sealsSec.head} blocks={sealsSec.blocks as any} />
      <StackSection head={stackSec.head} blocks={stackSec.blocks as any} />
      <CleanSection head={cleanSec.head} blocks={cleanSec.blocks as any} />
      <WearSection head={wearSec.head} blocks={wearSec.blocks as any} />
      <RangeSection head={rangeSec.head} blocks={rangeSec.blocks as any} />
      <FaqSection head={faqSec.head} blocks={faqSec.blocks as any} />
      <RelatedColumnsAndNote
        columns={BEARING_FOOTER.columns}
        note={BEARING_FOOTER.note}
      />
      <Footer />
    </>
  );
}
