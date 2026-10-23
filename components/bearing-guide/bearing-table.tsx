"use client";

import type { TableBlock } from "content/guides/bearings";
import { DragScrollArea } from "components/guides/drag-scroll-area";
import { renderRich } from "components/guides/rich";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export function BearingTable({
  table,
  fade = "white",
}: {
  table: TableBlock;
  fade?: "white" | "muted";
}) {
  const ariaLabel = table.cornerLabelScreenReaderOnly ?? "Comparison table";

  return (
    <DragScrollArea
      className="-mx-4 px-4 lg:mx-0 lg:px-0"
      ariaLabel={`${ariaLabel}, scrollable`}
      cue={true}
      fade={fade}
    >
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-40 pb-4 pr-6 align-bottom">
              {table.cornerLabelScreenReaderOnly && (
                <span className="sr-only">
                  {table.cornerLabelScreenReaderOnly}
                </span>
              )}
            </th>
            {table.columns.map((col) => (
              <th key={col.title} className="pb-4 pr-6 align-bottom">
                <span
                  className="block text-lg md:text-[24px] font-bold uppercase tracking-[-1%] text-black leading-tight"
                  style={CLASH}
                >
                  {col.title}
                </span>
                {col.subtitle && (
                  <span className="block text-xs md:text-sm text-neutral-500 mt-1 font-normal">
                    {col.subtitle}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.header} className="border-t border-neutral-100">
              <th
                scope="row"
                className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                style={CLASH}
              >
                {row.header}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={`py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] align-top ${
                    cell.muted ? "text-neutral-400 italic" : "text-black"
                  }`}
                >
                  {renderRich(cell.text)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DragScrollArea>
  );
}
