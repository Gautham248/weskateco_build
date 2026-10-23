"use client";

import type { AnatomyBlock } from "content/guides/bearings";
import { BearingAnatomyFig } from "components/bearing-guide/figures";
import {
  FigCard,
  FigHint,
  PanelKicker,
  GRID_CLASS,
} from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { useState } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export function AnatomyInteractive({ block }: { block: AnatomyBlock }) {
  const [selectedKey, setSelectedKey] = useState<string>(block.defaultPart);
  const part = block.parts.find((p) => p.key === selectedKey) ?? block.parts[0];

  return (
    <div className={GRID_CLASS}>
      {/* Figure Card */}
      <FigCard
        tone="muted"
        className="lg:col-span-7 w-full flex flex-col items-center"
      >
        <div className="w-full text-left">
          <FigHint>{block.hint}</FigHint>
        </div>
        <div className="mt-4 w-full flex items-center justify-center overflow-x-auto">
          <BearingAnatomyFig
            selectedPart={selectedKey}
            onSelectPart={setSelectedKey}
            className="w-full max-w-[496px] h-auto"
          />
        </div>
      </FigCard>

      {/* Part detail panel */}
      {part && (
        <div className="lg:col-span-5 flex flex-col gap-3 md:gap-4 p-2 lg:py-6">
          <PanelKicker>{`Part 0${part.number}`}</PanelKicker>
          <h3
            className="text-2xl md:text-[32px] font-bold tracking-[-1%] text-black uppercase leading-tight"
            style={CLASH}
          >
            {part.title}
          </h3>
          <p className="text-sm md:text-base text-black font-[400] leading-[160%]">
            {renderRich(part.body)}
          </p>
        </div>
      )}
    </div>
  );
}
