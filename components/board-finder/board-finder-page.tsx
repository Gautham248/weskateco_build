"use client";

import { useState } from "react";
import AnatomySection from "./anatomy";
import DecisionHelperSection from "./decision-helper";
import FaqSection from "./faq";
import BoardFinderHero from "./hero";
import GriptapeSection from "./griptape-table";
import MaintenanceSection from "./maintenance";
import QuizSection from "./quiz";
import SizeToolSection from "./size-tool";
import StyleCardsSection from "./style-cards";
import TrucksSection from "./trucks-section";

export type Unit = "UK" | "US";

export default function BoardFinderPage() {
  // Shared between the quiz's shoe-size step and the size tool — selecting a
  // band or a unit in either place updates the other.
  const [unit, setUnit] = useState<Unit>("UK");
  const [bandIndex, setBandIndex] = useState(2);

  return (
    <>
      <BoardFinderHero />
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
      <FaqSection />
    </>
  );
}
