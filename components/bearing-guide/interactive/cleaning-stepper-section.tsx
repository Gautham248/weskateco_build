"use client";

import type { StepperBlock } from "content/guides/bearings";
import { CleanStepFig } from "components/bearing-guide/figures";
import { FigCard, PanelKicker, GRID_CLASS } from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { WatchOutCallout } from "components/bearing-guide/bits";
import { useState } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export function CleaningStepperInteractive({ block }: { block: StepperBlock }) {
  const [stepIndex, setStepIndex] = useState(0);
  const total = block.steps.length; // 8
  const currentStep = (block.steps[stepIndex] ?? block.steps[0])!;

  const formatStepLabel = (n: number) => {
    return block.stepLabelPattern
      .replace("{n}", String(n).padStart(2, "0"))
      .replace("{total}", String(total).padStart(2, "0"));
  };

  return (
    <div className={GRID_CLASS}>
      {/* Left side: Step List */}
      <div className="lg:col-span-5 flex flex-col gap-2">
        <div
          role="tablist"
          aria-label="Cleaning steps"
          className="flex flex-col gap-2"
        >
          {block.steps.map((step, idx) => {
            const isActive = idx === stepIndex;
            return (
              <button
                key={step.n}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-pressed={isActive}
                onClick={() => setStepIndex(idx)}
                className={`w-full text-left p-3.5 md:p-4 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-[#F7F7F9] hover:bg-neutral-200 text-black border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <span
                    className={`text-xs md:text-sm font-bold uppercase tracking-wider shrink-0 ${
                      isActive ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <span
                    className="text-sm md:text-base font-semibold truncate uppercase tracking-[-0.5%]"
                    style={CLASH}
                  >
                    {step.title}
                  </span>
                </div>
                <span
                  aria-hidden
                  className={`text-xs uppercase tracking-wider font-semibold shrink-0 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Active
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Step Panel with drawing & instructions */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <FigCard tone="muted" className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-center overflow-x-auto">
            <CleanStepFig
              figure={currentStep.figure}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
        </FigCard>

        <div className="flex flex-col gap-4">
          <PanelKicker>{formatStepLabel(currentStep.n)}</PanelKicker>
          <h3
            className="text-xl md:text-[28px] font-bold tracking-[-1%] text-black uppercase leading-tight"
            style={CLASH}
          >
            {currentStep.title}
          </h3>

          <div className="flex flex-col gap-3">
            {currentStep.body.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base text-black font-[400] leading-[160%]"
              >
                {renderRich(para)}
              </p>
            ))}
          </div>

          {currentStep.watchOut && (
            <div className="mt-2">
              <WatchOutCallout
                label={block.watchOutLabel}
                text={currentStep.watchOut}
              />
            </div>
          )}

          {/* Stepper controls */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200 mt-2">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-2.5 rounded-4 border border-neutral-300 text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 cursor-pointer"
              style={CLASH}
            >
              {block.prevLabel}
            </button>
            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              {currentStep.n} / {total}
            </span>
            <button
              type="button"
              disabled={stepIndex === total - 1}
              onClick={() => setStepIndex((i) => Math.min(total - 1, i + 1))}
              className="px-4 py-2.5 rounded-4 bg-black text-white text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 cursor-pointer"
              style={CLASH}
            >
              {block.nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
