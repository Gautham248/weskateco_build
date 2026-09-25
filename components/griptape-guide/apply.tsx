"use client";

import {
  APPLY_SECTION,
  APPLY_STEPS,
  APPLY_TOOLS,
} from "lib/griptape-guide/data";
import { useState } from "react";
import { STEP_ICONS } from "./icons";
import {
  PanelKicker,
  ProseCols,
  SectionHeader,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function ApplySection() {
  const [step, setStep] = useState(0);
  const current = APPLY_STEPS[step]!;
  const Icon = STEP_ICONS[step]!;

  return (
    <Section id="apply">
      <Container>
        <SectionHeader
          kicker={APPLY_SECTION.kicker}
          title={APPLY_SECTION.title}
          intro={APPLY_SECTION.intro}
        />

        {/* Tools */}
        <ProseCols items={APPLY_TOOLS} tone="muted" />

        {/* Stepper */}
        <div className={GRID_CLASS}>
          {/* Step list */}
          <ol className="lg:col-span-4 flex flex-col gap-2">
            {APPLY_STEPS.map((s, i) => {
              const isActive = i === step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setStep(i)}
                    className={`w-full flex items-center gap-3 border-2 px-4 py-3 rounded-4 text-left cursor-pointer transition-colors ${
                      isActive
                        ? "border-black bg-neutral-100"
                        : "border-neutral-300 bg-white hover:border-black"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${isActive ? "text-black" : "text-neutral-500"}`}
                      style={CLASH}
                    >
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <span
                      className="text-sm font-semibold uppercase tracking-wider text-black"
                      style={CLASH}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Step panel */}
          <div className="lg:col-span-8 flex flex-col gap-4 bg-[#F7F7F9] rounded-[16px] p-5 md:p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                <Icon />
              </span>
              <div className="flex flex-col gap-1.5">
                <PanelKicker>
                  Step {String(current.n).padStart(2, "0")} of 07
                </PanelKicker>
                <h3
                  className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                  style={CLASH}
                >
                  {current.title}
                </h3>
              </div>
            </div>

            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {current.body}
            </p>

            <div className="border border-neutral-300 bg-neutral-100 rounded-[12px] p-4 flex flex-col gap-1.5">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full bg-black"
                />
                <span
                  className="text-xs font-semibold uppercase tracking-wider text-black"
                  style={CLASH}
                >
                  Watch out
                </span>
              </span>
              <p className="text-sm md:text-base text-black leading-[150%]">
                {current.watch}
              </p>
            </div>

            {/* Step navigation */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="border-2 border-black bg-white text-black px-6 py-2.5 rounded-4 text-sm font-semibold uppercase tracking-wider transition-colors enabled:hover:bg-black enabled:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={CLASH}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() =>
                  setStep((s) => Math.min(APPLY_STEPS.length - 1, s + 1))
                }
                disabled={step === APPLY_STEPS.length - 1}
                className="bg-black text-white px-6 py-2.5 rounded-4 text-sm font-semibold uppercase tracking-wider transition-colors enabled:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                style={CLASH}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
