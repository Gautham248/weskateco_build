"use client";

import boardTop from "components/icons/board_finder/board-top.webp";
import boardUnderside from "components/icons/board_finder/board-underside.webp";
import partSprite from "components/icons/board_finder/part-closeups-sprite.webp";
import Image from "next/image";
import { useState } from "react";
import { CAPTIONS, HINTS, PARTS } from "lib/board-finder/data";

type View = "top" | "under";

export default function AnatomySection() {
  const [view, setView] = useState<View>("top");
  // On load: Top view with part index 1 ("Deck") selected.
  const [selectedIndex, setSelectedIndex] = useState(1);

  const selected = PARTS[selectedIndex]!;
  const visibleParts = PARTS.filter((part) => part.view === view);

  function switchView(next: View) {
    setView(next);
    // Switching views auto-selects the first part for that view.
    const firstForView = PARTS.findIndex((part) => part.view === next);
    setSelectedIndex(firstForView);
  }

  return (
    <section className="w-full bg-[#F7F7F9] text-black py-8 md:py-14 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-4 md:gap-6">
        {/* Header + view toggle (one row to save vertical space) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2
              className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Anatomy of a complete skateboard
            </h2>
            <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
              Six parts, numbered. Tap a marker to see what it does.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="inline-flex rounded-[4px] border border-neutral-200 bg-white p-1 gap-1"
              role="group"
              aria-label="Board view"
            >
              {(
                [
                  ["top", "Top"],
                  ["under", "Bottom"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => switchView(value)}
                  aria-pressed={view === value}
                  className={`px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer ${
                    view === value
                      ? "bg-black text-white"
                      : "text-black hover:bg-neutral-100"
                  }`}
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-sm text-neutral-500">{HINTS[view]}</span>
          </div>
        </div>

        {/* Image with hotspots */}
        <div className="bg-white rounded-[20px] border border-neutral-100/80 p-3 md:p-5">
          <div className="relative w-full max-w-5xl mx-auto">
            <Image
              src={view === "top" ? boardTop : boardUnderside}
              alt={
                view === "top"
                  ? "Skateboard seen edge-on: griptape along the top and the seven-ply stack in the edge"
                  : "Underside of a built skateboard complete with both trucks and all four wheels"
              }
              width={1146}
              height={395}
              className="w-full h-auto rounded-[8px]"
            />

            {/* Numbered hotspots for the current view */}
            {visibleParts.map((part) => {
              const index = PARTS.indexOf(part);
              const isActive = index === selectedIndex;
              return (
                <button
                  key={part.n}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-pressed={isActive}
                  aria-label={`${part.n}. ${part.name}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all cursor-pointer border-2 ${
                    isActive
                      ? "bg-[#CCFF02] border-black text-black scale-110"
                      : "bg-white/90 border-black text-black hover:bg-[#CCFF02]"
                  }`}
                  style={{
                    left: `${part.x}%`,
                    top: `${part.y}%`,
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  {part.n}
                </button>
              );
            })}
          </div>

          <p className="text-xs md:text-sm text-neutral-500 leading-[150%] mt-2">
            {CAPTIONS[view]}
          </p>
        </div>

        {/* Detail card — IMAGE | LABEL + TITLE + DESCRIPTION | smaller SPECIFICATIONS */}
        <div
          key={selected.n}
          className="bg-white rounded-[20px] border border-neutral-100/80 p-5 md:p-6 grid grid-cols-1 md:grid-cols-[auto_60fr_40fr] gap-5 md:gap-6 lg:gap-8 items-start"
        >
          {/* Left — small close-up from the sprite sheet: frame = index in PARTS, background-position {i*20}% 0 */}
          <div
            aria-hidden
            className="w-40 lg:w-48 aspect-square rounded-[12px] border border-neutral-100 shrink-0"
            style={{
              backgroundImage: `url(${partSprite.src})`,
              backgroundSize: "600% 100%",
              backgroundPosition: `${PARTS.indexOf(selected) * 20}% 0`,
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Middle — section label, heading, description */}
          <div className="flex flex-col gap-3 md:gap-4">
            <span
              className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Part {String(selected.n).padStart(2, "0")} of{" "}
              {String(PARTS.length).padStart(2, "0")}
            </span>

            <h3
              className="text-xl md:text-[24px] font-bold tracking-[-1%] text-black uppercase leading-[110%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {selected.name}
            </h3>

            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              {selected.text}
            </p>
          </div>

          {/* Right of the description — compact specification rows */}
          <dl className="flex flex-col">
            {selected.spec.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 py-1.5 border-b border-neutral-100 last:border-b-0"
              >
                <dt className="text-[11px] md:text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {label}
                </dt>
                <dd className="text-xs md:text-sm font-semibold text-black text-right">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
