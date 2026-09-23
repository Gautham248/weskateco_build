import type { TableCol, TableCell, TableRow } from "lib/truck-guide/data";
import type { ReactNode } from "react";
import { renderRich } from "./rich";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

/** Section kicker — matches the wheel guide's `01 — Parts` label style. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
      {children}
    </span>
  );
}

/** Small panel kicker — "Part 01 of 09", "Deck width". */
export function PanelKicker({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
      style={CLASH}
    >
      {children}
    </span>
  );
}

/** Kicker + h2 + intro, the standard section opener. */
export function SectionHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
      <Kicker>{kicker}</Kicker>
      <h2
        className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
        style={CLASH}
      >
        {title}
      </h2>
      <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
        {renderRich(intro)}
      </p>
    </div>
  );
}

/** Mid-section sub-head — rule + kicker + h3 + intro paragraph. */
export function SubHead({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 max-w-3xl pt-6 md:pt-8 border-t border-neutral-200">
      <Kicker>{kicker}</Kicker>
      <h3
        className="text-xl md:text-[32px] font-bold tracking-[-1%] text-black uppercase leading-none"
        style={CLASH}
      >
        {title}
      </h3>
      <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
        {renderRich(intro)}
      </p>
    </div>
  );
}

/**
 * Two/three-column prose cards. `tone` is the section background the cards
 * sit on: "muted" cards are grey (on white sections), "plain" cards are
 * white with a border (on #F7F7F9 sections). `text` may contain `\n\n`
 * paragraph breaks, which render as separate paragraphs in the same card.
 */
export function ProseCols({
  items,
  columns = 2,
  tone,
}: {
  items: { title: string; text: string; tag?: string }[];
  columns?: 2 | 3;
  tone: "muted" | "plain";
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 md:gap-6 ${columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className={`rounded-[16px] p-5 md:p-8 ${tone === "muted" ? "bg-[#F7F7F9]" : "bg-white border border-neutral-200"}`}
        >
          <h3
            className="text-base md:text-xl font-bold tracking-[-1%] text-black uppercase leading-none"
            style={CLASH}
          >
            {item.title}
            {item.tag && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#EAFBFF] border border-[#80E5FF] text-xs font-semibold uppercase tracking-wider align-middle">
                {item.tag}
              </span>
            )}
          </h3>
          {item.text.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className={`text-sm md:text-base text-black font-[400] leading-[150%] ${i === 0 ? "mt-3" : "mt-3"}`}
            >
              {renderRich(paragraph)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Emphasised note paragraph — bold lead, muted body, bordered card. */
export function Note({ text }: { text: string }) {
  return (
    <p className="max-w-4xl border border-neutral-200 rounded-[16px] p-5 md:p-6 text-sm md:text-base text-neutral-600 leading-[160%]">
      {renderRich(text)}
    </p>
  );
}

/** Term / note / definition list — bushings, care sections. */
export function DefList({
  items,
}: {
  items: { term: string; note: string; def: string }[];
}) {
  return (
    <dl className="flex flex-col border-t border-neutral-100">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10 py-5 md:py-7 border-b border-neutral-100"
        >
          <dt className="lg:col-span-4 flex flex-col gap-1.5">
            <span
              className="text-lg md:text-[24px] font-bold tracking-[-1%] uppercase leading-[110%] text-black"
              style={CLASH}
            >
              {item.term}
            </span>
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {item.note}
            </span>
          </dt>
          <dd className="lg:col-span-8 text-sm md:text-base text-black font-[400] leading-[160%]">
            {renderRich(item.def)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Label/value spec rows — truck part detail panels. */
export function SpecList({ spec }: { spec: [string, string][] }) {
  return (
    <dl className="flex flex-col mt-1">
      {spec.map(([label, value], i) => (
        <div
          key={label}
          className={`flex items-baseline justify-between gap-6 py-2 ${
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

function renderCell(cell: TableCell) {
  if (typeof cell === "string") {
    return <>{renderRich(cell)}</>;
  }
  return (
    <span className={cell.warn ? "text-amber-800" : undefined}>
      {cell.warn && (
        <span
          aria-hidden
          className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle"
        />
      )}
      {renderRich(cell.text)}
    </span>
  );
}

/** Comparison table — the board finder's griptape-table pattern, with
 * optional `warnRow` tint for flagged rows. */
export function GuideTable({
  srLabel,
  cols,
  rows,
  minW = "min-w-[720px]",
}: {
  srLabel: string;
  cols: TableCol[];
  rows: TableRow[];
  minW?: string;
}) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
      <table className={`w-full ${minW} border-collapse text-left`}>
        <thead>
          <tr>
            <th className="w-40">
              <span className="sr-only">{srLabel}</span>
            </th>
            {cols.map((col) => (
              <th key={col.name} className="pb-4 pr-6 align-bottom">
                <span
                  className="block text-lg md:text-[24px] font-bold uppercase tracking-[-1%] text-black"
                  style={CLASH}
                >
                  {col.name}
                </span>
                {col.sub && (
                  <span className="block text-xs md:text-sm text-neutral-500 mt-1">
                    {col.sub}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={`border-t border-neutral-100 ${row.warnRow ? "bg-amber-50/60" : ""}`}
            >
              <th
                scope="row"
                className={`py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider align-top ${row.warnRow ? "text-amber-800" : "text-neutral-500"}`}
              >
                {row.label}
                {row.note && <> {row.note}</>}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top"
                >
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Segmented toggle group with aria-pressed buttons. */
export function Seg({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { readonly id: string; readonly label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap border border-neutral-300 rounded-[4px] overflow-hidden bg-white"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-wider border-r border-neutral-300 last:border-r-0 transition-colors cursor-pointer ${
            value === option.id
              ? "bg-black text-white"
              : "text-black hover:bg-neutral-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Diagram card — grey on white sections, white on grey sections. */
export function FigCard({
  tone,
  className = "",
  children,
}: {
  tone: "muted" | "plain";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-[16px] p-5 md:p-8 ${tone === "muted" ? "bg-[#F7F7F9]" : "bg-white border border-neutral-200"} ${className}`}
    >
      {children}
    </div>
  );
}

/** Small grey hint above/beside a diagram. */
export function FigHint({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs md:text-sm text-neutral-500 leading-[150%] ${className}`}
    >
      {children}
    </p>
  );
}

/** Figure caption — the muted explanatory line under each diagram. */
export function FigCaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-4 text-xs md:text-sm text-neutral-500 leading-[160%] max-w-4xl">
      {children}
    </figcaption>
  );
}

/**
 * Dashed "Photography pending" note — stands in where the spec calls for
 * a future photograph but a reference drawing is showing instead. The
 * pending copy itself always starts "Photography pending", so no extra
 * chrome is added beyond the dashed treatment.
 */
export function PendingNote({ text }: { text: string }) {
  return (
    <p className="border border-dashed border-neutral-300 rounded-[12px] bg-white/60 p-4 text-xs md:text-sm text-neutral-500 leading-[160%]">
      {renderRich(text)}
    </p>
  );
}

/**
 * "Photo(s) to come" checklist card — the pending state for a photo spot
 * with no drawing to stand in for it yet. `alt` is the spec's suggested
 * alt text for the future photo, exposed to screen readers via figure.
 */
export function PendingCard({
  kicker,
  title,
  brief,
  shots,
  alt,
}: {
  kicker: string;
  title: string;
  brief: string;
  shots: (string | { title: string; text: string })[];
  alt?: string;
}) {
  return (
    <figure
      aria-label={alt}
      className="rounded-[16px] border border-dashed border-neutral-300 bg-white/60 p-5 md:p-8 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
          style={CLASH}
        >
          {kicker}
        </span>
        <h3
          className="text-base md:text-xl font-bold tracking-[-1%] text-black uppercase leading-none"
          style={CLASH}
        >
          {title}
        </h3>
        <p className="text-sm md:text-base text-neutral-600 leading-[150%]">
          {renderRich(brief)}
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {shots.map((shot) => (
          <li
            key={typeof shot === "string" ? shot : shot.title}
            className="flex gap-3 items-start"
          >
            <span
              aria-hidden
              className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0"
            />
            <span className="text-sm text-neutral-600 leading-[150%]">
              {typeof shot === "string" ? (
                renderRich(shot)
              ) : (
                <>
                  <span className="font-semibold text-black">{shot.title}</span>
                  {" — "}
                  {shot.text}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
