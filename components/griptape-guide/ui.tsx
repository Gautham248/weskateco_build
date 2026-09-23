import type { TableCol, TableCell, TableRow } from "lib/griptape-guide/data";
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

/** Small panel kicker — "Layer 01 of 05", "Step 01 of 07". */
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
 * white with a border (on #F7F7F9 sections). `sub` renders a muted line
 * between the title and the body; `text` may contain `\n\n` paragraph
 * breaks.
 */
export function ProseCols({
  items,
  columns = 2,
  tone,
}: {
  items: { title: string; text: string; tag?: string; sub?: string }[];
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
          {item.sub && (
            <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {item.sub}
            </p>
          )}
          {item.text.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mt-3 text-sm md:text-base text-black font-[400] leading-[150%]"
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

/** Term / note / definition list — the code and material explainers. */
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

/** Label/value spec rows — layer detail panels. */
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

function cellSpan(cell: TableCell): number | undefined {
  return typeof cell === "string" ? undefined : cell.span;
}

/** Comparison table — the griptape-table pattern, with `span` support for
 * merged cells and optional `warnRow` tint. */
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
                  colSpan={cellSpan(cell)}
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
  children?: ReactNode;
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
