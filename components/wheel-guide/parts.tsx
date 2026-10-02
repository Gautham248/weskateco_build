"use client";

import anatomyImg from "components/icons/wheel_guide/wheel-anatomy.jpeg";
import { PARTS_INTRO, WHEEL_PARTS } from "lib/wheel-guide/data";
import {
  SectionHeader,
  Container,
  Section,
  FigHint,
} from "components/guides/ui";
import Image from "next/image";
import { useState } from "react";

/**
 * Hotspot positions, as % of the anatomy photograph's box.
 *
 * Read off the annotated reference image, so these follow the photo rather than
 * a drawing: the photograph is 650×820 portrait, and the wheel is not centred in
 * it, which is why the values are not symmetric.
 *
 * 5 and 6 are the closest pair on the wheel — the top of the core and the bore
 * in its middle. 6 sits a little further right and lower than its true centre so
 * the two buttons do not overlap at phone widths, where the whole figure is
 * under 300px wide.
 */
const HOTSPOTS: Record<number, { left: string; top: string }> = {
  1: { left: "47%", top: "4%" }, // riding surface
  2: { left: "47%", top: "96%" }, // contact patch
  3: { left: "10%", top: "91%" }, // lips
  4: { left: "90%", top: "58%" }, // sidewall
  5: { left: "46%", top: "25%" }, // core
  6: { left: "64%", top: "49%" }, // bearing seats — nudged clear of 5
  7: { left: "74%", top: "76%" }, // the urethane
};

type WheelPartSpec = (typeof WHEEL_PARTS)[number]["spec"];

// Spec rows (What it is / Wears by / …) — rendered twice: inside the grey
// detail card at lg, and as its own full-width box below lg.
function SpecRows({ spec }: { spec: WheelPartSpec }) {
  return (
    <dl className="flex flex-col">
      {spec.map(([label, value], i) => (
        <div
          key={label}
          className={`flex items-baseline justify-between gap-3 md:gap-6 py-2 ${
            i < spec.length - 1 ? "border-b border-neutral-200" : ""
          }`}
        >
          <dt className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </dt>
          <dd className="text-sm md:text-base text-black text-right font-[400]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function PartsSection() {
  const [selected, setSelected] = useState(1);
  const part = WHEEL_PARTS[selected - 1]!;

  return (
    <Section id="parts">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker="01 — Parts"
          title="Anatomy of a wheel"
          intro={PARTS_INTRO}
        />

        {/* Local grid variant: 45/55 two-column split below lg so the diagram
            sits left and the detail right on phones (GRID_CLASS stacks them). */}
        <div className="grid grid-cols-[9fr_11fr] gap-3 md:gap-6 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Diagram with hotspots */}
          <div className="lg:col-span-5 w-full bg-[#F7F7F9] rounded-[16px] p-4 md:p-8 flex flex-col items-center">
            <div className="relative w-full max-w-[360px]">
              {/* Portrait photograph, so the box follows its own ratio rather
                  than a fixed height — that is what keeps the hotspots, which
                  are positioned as a % of this same box, on the right parts at
                  every width. */}
              <Image
                src={anatomyImg}
                alt="A skateboard wheel cut clean through the axle, showing the urethane body, the core and the bearing seat"
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 60vw"
                className="h-auto w-full rounded-[12px]"
              />
              {WHEEL_PARTS.map((p) => {
                const pos = HOTSPOTS[p.n]!;
                const isActive = p.n === selected;
                return (
                  <button
                    key={p.n}
                    type="button"
                    onClick={() => setSelected(p.n)}
                    aria-pressed={isActive}
                    aria-label={`Part ${p.n}: ${p.name}`}
                    className={`absolute w-6 h-6 text-[10px] md:w-9 md:h-9 md:text-sm -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors ${
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
                    {p.n}
                  </button>
                );
              })}
            </div>
            <FigHint className="mt-4 text-center">
              Tap a number to inspect that part. Cut through the axle.
            </FigHint>
          </div>

          {/* Detail panel. Below lg this wrapper is display:contents so its
              cards become direct grid items — detail sits beside the diagram
              while the explainer spans the full grid width (its old stacked
              width). At lg it restores to the original flex column. */}
          <div className="contents lg:col-span-7 lg:flex lg:flex-col gap-5 md:gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] p-4 md:p-8 flex flex-col gap-4">
              <span
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Part {String(part.n).padStart(2, "0")} of 07
              </span>
              <h3
                className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {part.name}
              </h3>
              <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
                {part.text}
              </p>
              <div className="hidden lg:block mt-1">
                <SpecRows spec={part.spec} />
              </div>
            </div>

            {/* Spec rows — own full-width box below lg (hidden at lg, where
                they render inside the grey detail card above). */}
            <div className="col-span-2 border border-neutral-200 rounded-[16px] p-4 md:p-8 lg:hidden">
              <SpecRows spec={part.spec} />
            </div>

            {/* Overall width vs contact patch explainer — full grid width
                below lg (col-span-2); ignored at lg where it lives in the
                restored flex column. */}
            <div className="col-span-2 border border-neutral-200 rounded-[16px] p-4 md:p-8 flex flex-col gap-3">
              <h3
                className="text-base md:text-xl font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Overall width ≠ contact patch
              </h3>
              <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                Overall width is the whole wheel, edge to edge — the 33mm in
                53&nbsp;×&nbsp;33mm. The contact patch is only the strip of
                urethane actually on the road at any one moment, and it is
                always narrower: about 18–21mm of that 33. Grip, slide and wear
                all happen inside the contact patch, which is why the second
                number printed on the box is the one that decides nothing.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
