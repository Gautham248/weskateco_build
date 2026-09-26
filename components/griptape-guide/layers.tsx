"use client";

import crossSectionImg from "components/icons/griptape_guide/griptape-cross-section.png";
import Image from "next/image";
import { useState } from "react";
import {
  LAYERS,
  LAYERS_IMAGE_ALT,
  LAYERS_SECTION,
} from "lib/griptape-guide/data";
import {
  PanelKicker,
  SectionHeader,
  SpecList,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

// Hotspot button positions, as % centres over the cross-section PNG.
const HOTSPOTS: Record<number, { left: string; top: string }> = {
  1: { left: "14%", top: "12%" },
  2: { left: "45%", top: "24%" },
  3: { left: "68%", top: "32%" },
  4: { left: "84%", top: "41%" },
  5: { left: "13%", top: "58%" },
};

export default function LayersSection() {
  const [selected, setSelected] = useState(1);
  const layer = LAYERS.find((l) => l.n === selected) ?? LAYERS[0]!;

  return (
    <Section id="layers">
      <Container>
        <SectionHeader
          kicker={LAYERS_SECTION.kicker}
          title={LAYERS_SECTION.title}
          intro={LAYERS_SECTION.intro}
        />

        <div className={GRID_CLASS}>
          {/* Cross-section with hotspots */}
          <div className="lg:col-span-7 w-full bg-[#F7F7F9] rounded-[16px] p-5 md:p-8">
            <div className="relative w-full overflow-hidden rounded-[8px]">
              <Image
                src={crossSectionImg}
                alt={LAYERS_IMAGE_ALT}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="w-full h-auto"
                priority
              />
              {LAYERS.map((layer) => {
                const pos = HOTSPOTS[layer.n]!;
                const isActive = layer.n === selected;
                return (
                  <button
                    key={layer.n}
                    type="button"
                    onClick={() => setSelected(layer.n)}
                    aria-pressed={isActive}
                    aria-label={`Layer ${layer.n}: ${layer.name}`}
                    className={`absolute w-8 h-8 md:w-9 md:h-9 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-colors ${
                      isActive
                        ? "bg-black text-white border-2 border-black"
                        : "bg-white text-black border-2 border-black hover:bg-neutral-200"
                    }`}
                    style={{
                      left: pos.left,
                      top: pos.top,
                      fontFamily: "'Clash Display', sans-serif",
                    }}
                  >
                    {layer.n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-[#F7F7F9] rounded-[16px] p-5 md:p-8">
            <PanelKicker>
              Layer {String(layer.n).padStart(2, "0")} of 05
            </PanelKicker>
            <h3
              className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {layer.name}
            </h3>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {layer.text}
            </p>
            <SpecList spec={layer.spec} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
