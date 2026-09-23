"use client";

import { useEffect, useState } from "react";
import { CARE_ITEMS, CARE_STORAGE_KEY } from "lib/board-finder/data";

const REFERENCE_ROWS: [string, string][] = [
  ["Skate tool", "One T-tool, every fastener"],
  ["Bearing lube", "Every few weeks"],
  ["Grip cleaner", "Or a stiff brush"],
  ["Spares", "All parts standard sized"],
];

const QUICK_BULLETS = [
  "First-time skater? Get a beginner complete.",
  "Buying for a small kid? 7″ is the smallest we build.",
  "Unsure about size? Use shoe size as the guide.",
  "Buying for yourself? 8″ is the common adult street size here.",
  "Riding a park? Add a helmet before you add anything else.",
];

const DEFAULT_STATE = CARE_ITEMS.map(() => false);

function loadChecked(): boolean[] {
  try {
    const raw = window.localStorage.getItem(CARE_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.length === CARE_ITEMS.length &&
      parsed.every((v) => typeof v === "boolean")
    ) {
      return parsed;
    }
    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}
import { Container, Section, GRID_CLASS, H2_CLASS } from "components/guides/ui";

export default function MaintenanceSection() {
  const [checked, setChecked] = useState<boolean[]>(DEFAULT_STATE);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setChecked(loadChecked());
  }, []);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = prev.map((value, i) => (i === index ? !value : value));
      try {
        window.localStorage.setItem(CARE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable — state still works for this session.
      }
      return next;
    });
  }

  const doneCount = checked.filter(Boolean).length;

  return (
    <Section scroll={false}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Maintenance
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Easier than it looks. Tick these off as you go — the page remembers
            on this device.
          </p>
        </div>

        <div className={GRID_CLASS}>
          {/* Checklist */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <span
                className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
                aria-live="polite"
              >
                {doneCount} of {CARE_ITEMS.length} done
              </span>
              <div
                className="h-1.5 w-40 md:w-60 bg-neutral-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={doneCount}
                aria-valuemin={0}
                aria-valuemax={CARE_ITEMS.length}
                aria-label="Maintenance checklist progress"
              >
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: `${(doneCount / CARE_ITEMS.length) * 100}%` }}
                />
              </div>
            </div>

            <ul className="flex flex-col border-y border-neutral-100">
              {CARE_ITEMS.map(([title, detail], index) => (
                <li
                  key={title}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <label className="flex items-start gap-4 py-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked[index] ?? false}
                      onChange={() => toggle(index)}
                      className="mt-1 w-5 h-5 shrink-0 accent-black cursor-pointer"
                    />
                    <span className="flex flex-col gap-1">
                      <span
                        className={`text-base md:text-lg font-semibold uppercase tracking-[-1%] transition-colors ${
                          checked[index]
                            ? "text-neutral-400 line-through"
                            : "text-black"
                        }`}
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {title}
                      </span>
                      <span className="text-sm text-neutral-500 leading-[140%]">
                        {detail}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Reference panel + quick checklist */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-6 md:p-8">
              <h3
                className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%] mb-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Reference
              </h3>
              <dl className="flex flex-col">
                {REFERENCE_ROWS.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-3 border-b border-neutral-200 last:border-b-0"
                  >
                    <dt className="text-xs md:text-sm font-medium uppercase tracking-wider text-neutral-500">
                      {label}
                    </dt>
                    <dd
                      className="text-sm md:text-base font-semibold text-black text-right"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-6 md:p-8">
              <h3
                className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%] mb-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Quick checklist
              </h3>
              <ul className="flex flex-col gap-3">
                {QUICK_BULLETS.map((bullet) => (
                  <li key={bullet} className="flex gap-3 items-start">
                    <span className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />
                    <span className="text-sm md:text-base text-black leading-[150%] font-[400]">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
