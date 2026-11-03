"use client";

import type { DiagnosisBlock } from "content/guides/bearings";
import { PanelKicker, GRID_CLASS } from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { useState } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export function DiagnosisInteractive({ block }: { block: DiagnosisBlock }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = (block.symptoms[selectedIndex] ?? block.symptoms[0])!;

  const formatSymptomLabel = (n: number) => {
    return block.symptomLabelPattern.replace("{n}", String(n).padStart(2, "0"));
  };

  return (
    <div className={GRID_CLASS}>
      {/* Left side: Symptoms list */}
      <div className="lg:col-span-5 flex flex-col gap-2">
        <div
          role="tablist"
          aria-label="Bearing wear symptoms"
          className="flex flex-col gap-2"
        >
          {block.symptoms.map((symptom, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={symptom.n}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-pressed={isActive}
                onClick={() => setSelectedIndex(idx)}
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
                    {String(symptom.n).padStart(2, "0")}
                  </span>
                  <span
                    className="text-sm md:text-base font-semibold truncate uppercase tracking-[-0.5%]"
                    style={CLASH}
                  >
                    {symptom.symptom}
                  </span>
                </div>
                <span
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    symptom.verdictTone === "bad"
                      ? isActive
                        ? "bg-red-900 text-red-200"
                        : "bg-red-100 text-red-800"
                      : isActive
                        ? "bg-neutral-800 text-neutral-200"
                        : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {symptom.verdict}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Diagnosis detail card */}
      <div className="lg:col-span-7 flex flex-col gap-4 p-5 md:p-8 rounded-[16px] bg-[#F7F7F9] border border-neutral-200/60">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200">
          <PanelKicker>{formatSymptomLabel(current.n)}</PanelKicker>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              current.verdictTone === "bad"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-neutral-200 text-neutral-900 border border-neutral-300"
            }`}
          >
            {current.verdict}
          </span>
        </div>

        <h3
          className="text-xl md:text-[28px] font-bold tracking-[-1%] text-black uppercase leading-tight"
          style={CLASH}
        >
          {current.symptom}
        </h3>

        <div className="flex flex-col gap-3 mt-1">
          {current.body.map((para, i) => (
            <p
              key={i}
              className="text-sm md:text-base text-black font-[400] leading-[160%]"
            >
              {renderRich(para)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
