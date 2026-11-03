"use client";

import type { AxleStackBlock } from "content/guides/bearings";
import { AxleStackFig } from "components/bearing-guide/figures";
import { FigCard, FigHint, Seg } from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { useState } from "react";

export function AxleStackInteractive({ block }: { block: AxleStackBlock }) {
  const [mode, setMode] = useState<"with" | "without">(block.defaultMode);

  const segOptions = block.toggle.map((t) => ({
    id: t.mode,
    label: t.label,
  }));

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FigHint>{block.hint}</FigHint>
        <Seg
          label="Axle stack setup"
          options={segOptions}
          value={mode}
          onChange={(newMode) => setMode(newMode as "with" | "without")}
        />
      </div>

      <FigCard tone="muted" className="w-full flex flex-col items-center">
        <div className="w-full flex items-center justify-center overflow-x-auto">
          <AxleStackFig mode={mode} className="w-full max-w-[620px] h-auto" />
        </div>
        <figcaption
          aria-live="polite"
          className="mt-4 text-xs md:text-sm text-neutral-500 leading-[160%] max-w-4xl w-full text-left"
        >
          {renderRich(block.captions[mode])}
        </figcaption>
      </FigCard>
    </div>
  );
}
