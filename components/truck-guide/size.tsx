"use client";

import {
  BEGINNER_ROW,
  BEGINNER_WIDTHS,
  CALC_NOTES,
  CALC_ROWS,
  CALC_SUB,
  DEFAULT_WIDTH,
  DECK_WIDTHS,
  SIZE_CARDS,
  SIZE_NOTE,
  SIZE_SECTION,
  TOUCAN_MAP,
} from "lib/truck-guide/data";
import { useState } from "react";
import {
  ProseCols,
  Note,
  SectionHeader,
  SubHead,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

function statusChip(label: string) {
  const highlighted = label === "Coming soon";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider border whitespace-nowrap ${
        highlighted
          ? "bg-black border-black text-white"
          : "bg-neutral-100 border-neutral-200 text-neutral-500"
      }`}
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {label}
    </span>
  );
}

interface ResultRow {
  id: string;
  label: string;
  sub: string;
  value: string;
  chip: string | null;
}

function computeRows(w: number, isBeginner: boolean): ResultRow[] {
  const toucan =
    TOUCAN_MAP.find(
      (band) => w >= band.min && (band.max === null || w < band.max),
    ) ?? TOUCAN_MAP[TOUCAN_MAP.length - 1]!;

  const rows: ResultRow[] = [
    {
      id: "toucan",
      label: "Toucan",
      sub: `${toucan.line} — quoted by hanger width`,
      value: toucan.value,
      chip: null,
    },
  ];

  if (isBeginner)
    rows.push({
      id: "beginner",
      label: BEGINNER_ROW.label,
      sub: BEGINNER_ROW.sub,
      value: BEGINNER_ROW.value,
      chip: BEGINNER_ROW.chip,
    });

  for (const row of CALC_ROWS) {
    const matches = row.ladder.filter(
      (s) => w >= s.min && (s.max === null || w < s.max),
    );
    const value = matches.length
      ? matches.map((s) => s.size).join(" or ")
      : "Not made in this size";
    const chip = row.reference
      ? "Size reference"
      : matches.length === 0
        ? null
        : matches.some((s) => s.onOrder)
          ? "Coming soon"
          : "Not stocked";
    rows.push({ id: row.id, label: row.label, sub: row.sub, value, chip });
  }

  return rows;
}

export default function SizeSection() {
  const [selected, setSelected] = useState(DEFAULT_WIDTH);

  const width =
    DECK_WIDTHS.find((d) => d.label === selected) ?? DECK_WIDTHS[4]!;
  const isBeginner = BEGINNER_WIDTHS.includes(selected);
  const rows = computeRows(width.w, isBeginner);

  return (
    <Section id="size" bg="muted">
      <Container>
        <SectionHeader
          kicker={SIZE_SECTION.kicker}
          title={SIZE_SECTION.title}
          intro={SIZE_SECTION.intro}
        />

        <ProseCols items={SIZE_CARDS} columns={3} tone="plain" />

        <Note text={SIZE_NOTE} />

        <SubHead
          kicker={CALC_SUB.kicker}
          title={CALC_SUB.title}
          intro={CALC_SUB.intro}
        />

        <div className={GRID_CLASS}>
          {/* Deck-width chips + notes */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div
              role="group"
              aria-label="Deck width"
              className="flex flex-wrap gap-2"
            >
              {DECK_WIDTHS.map((d) => {
                const isActive = d.label === selected;
                return (
                  <button
                    key={d.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelected(d.label)}
                    className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-300 hover:border-black"
                    }`}
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 text-sm md:text-base text-neutral-600 leading-[160%]">
              {CALC_NOTES.map((note) => (
                <p key={note.slice(0, 32)}>{note}</p>
              ))}
            </div>
          </div>

          {/* Output panel */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-200 rounded-[16px] p-5 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Deck width
                </span>
                <h3
                  className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {width.label} deck
                </h3>
                <span
                  className="text-xs md:text-sm font-medium uppercase tracking-wider text-[#00000080]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {isBeginner ? "A beginner complete width" : "Pro deck width"}
                </span>
              </div>

              <div className="flex flex-col divide-y divide-neutral-100 border-t border-neutral-100">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-start justify-between gap-3 py-3.5"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span
                        className="text-sm md:text-base font-bold uppercase tracking-[-1%] text-black"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {row.label}
                      </span>
                      <span className="text-xs md:text-sm text-neutral-500 leading-[150%]">
                        {row.sub}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 text-right">
                      <span className="text-sm md:text-base font-semibold text-black whitespace-nowrap">
                        {row.value}
                      </span>
                      {row.chip && statusChip(row.chip)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
