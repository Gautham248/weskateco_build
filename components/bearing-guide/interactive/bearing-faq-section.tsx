"use client";

import type { FaqBlock } from "content/guides/bearings";
import { ChevronDownIcon } from "components/guides/icons";
import { renderRich } from "components/guides/rich";
import { StockedCallout } from "components/bearing-guide/bits";
import { useState } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export function BearingFaqInteractive({ block }: { block: FaqBlock }) {
  // All collapsed initially as required by the spec
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200 max-w-4xl">
      {block.items.map((item, index) => {
        const isOpen = openIndex === index;
        const btnId = `bearing-faq-btn-${index}`;
        const panelId = `bearing-faq-panel-${index}`;

        return (
          <div key={item.question} className="py-2">
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex items-center justify-between gap-4 w-full text-left py-4 transition-colors cursor-pointer group"
              >
                <span
                  className="text-base md:text-[20px] font-semibold tracking-[-1%] text-black uppercase leading-[120%]"
                  style={CLASH}
                >
                  {item.question}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-black text-white rotate-180"
                      : "bg-[#F7F7F9] text-black group-hover:bg-neutral-200"
                  }`}
                >
                  <ChevronDownIcon />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="flex flex-col gap-4 pb-5 pr-4 md:pr-10"
            >
              <div className="flex flex-col gap-3">
                {item.answer.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm md:text-base text-black font-[400] leading-[160%]"
                  >
                    {renderRich(para)}
                  </p>
                ))}
              </div>
              {item.stocked && (
                <div className="mt-1">
                  <StockedCallout
                    label={item.stocked.label}
                    text={item.stocked.text}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
