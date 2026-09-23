"use client";

import GuideFaq from "components/guides/faq";
import GuideHero from "components/guides/hero";
import { FAQ } from "lib/board-finder/data";
import { useState } from "react";
import AnatomySection from "./anatomy";
import DecisionHelperSection from "./decision-helper";
import GriptapeSection from "./griptape-table";
import MaintenanceSection from "./maintenance";
import QuizSection from "./quiz";
import SizeToolSection from "./size-tool";
import StyleCardsSection from "./style-cards";
import TrucksSection from "./trucks-section";

export type Unit = "UK" | "US";

// The hero copy, previously inline in components/board-finder/hero.tsx.
const BOARD_FINDER_HERO = {
  eyebrow: "Sphere Skateboards · WeSkate Co. · Built for Indian streets",
  titleLead: "Skateboard",
  titleAccent: "Buying Guide",
  lede: "New to skateboarding, upgrading a setup, or buying for someone else? Answer four questions and walk away with the four numbers that decide how a board rides: deck width (how wide the board is), concave (how curved it is), truck width and wheel diameter.",
  ctaPrimary: { label: "Find my board →", href: "#find-your-board" },
  ctaSecondary: {
    label: "Shop completes",
    href: "/store/skateboard-completes",
  },
};

export default function BoardFinderPage() {
  // Shared between the quiz's shoe-size step and the size tool — selecting a
  // band or a unit in either place updates the other.
  const [unit, setUnit] = useState<Unit>("UK");
  const [bandIndex, setBandIndex] = useState(2);

  return (
    <>
      <GuideHero
        hero={BOARD_FINDER_HERO}
        ctaStyle={{ fontFamily: "'Clash Display', sans-serif" }}
      />
      <QuizSection
        unit={unit}
        setUnit={setUnit}
        bandIndex={bandIndex}
        setBandIndex={setBandIndex}
      />
      <AnatomySection />
      <SizeToolSection
        unit={unit}
        setUnit={setUnit}
        bandIndex={bandIndex}
        setBandIndex={setBandIndex}
      />
      <GriptapeSection />
      <TrucksSection />
      <DecisionHelperSection />
      <StyleCardsSection />
      <MaintenanceSection />
      <GuideFaq
        items={FAQ}
        idBase="faq"
        variant="chevron"
        title="FAQ"
        headerWidth="2xl"
        scroll={false}
        stockLabel="What we stock:"
      />
    </>
  );
}
