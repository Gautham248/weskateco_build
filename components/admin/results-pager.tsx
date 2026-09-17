"use client";

import clsx from "clsx";
import { pageList } from "lib/admin/pagination";

export function ResultsPager({
  rangeStart,
  rangeEnd,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        Showing {rangeStart}–{rangeEnd} of {total} product
        {total === 1 ? "" : "s"}
      </span>

      {totalPages > 1 ? (
        <nav aria-label="Product pages" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            ← Prev
          </button>

          {pageList(currentPage, totalPages).map((entry, index) =>
            entry === "gap" ? (
              <span
                key={`gap-${index}`}
                className="px-1 text-xs text-neutral-400"
              >
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => onPageChange(entry)}
                aria-current={entry === currentPage ? "page" : undefined}
                className={clsx(
                  "min-w-8 cursor-pointer rounded-sm border px-2.5 py-1 text-xs font-semibold transition-colors",
                  entry === currentPage
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
                )}
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Next →
          </button>
        </nav>
      ) : null}
    </div>
  );
}
