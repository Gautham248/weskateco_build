export const ADMIN_RESULTS_PAGE_SIZE = 12;

/** Windowed page numbers, so a large catalog doesn't render 40 buttons. */
export function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const wanted = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...wanted]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const output: (number | "gap")[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous !== 0 && page - previous > 1) {
      output.push("gap");
    }
    output.push(page);
    previous = page;
  }

  return output;
}

export type AdminPage<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
};

/**
 * Clamps the requested page into range rather than trusting the caller: a filter
 * change can shrink the result set out from under a page number that was valid
 * a moment ago.
 */
export function paginate<T>(items: T[], page: number): AdminPage<T> {
  const totalPages = Math.max(
    1,
    Math.ceil(items.length / ADMIN_RESULTS_PAGE_SIZE),
  );
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * ADMIN_RESULTS_PAGE_SIZE;

  return {
    items: items.slice(start, start + ADMIN_RESULTS_PAGE_SIZE),
    currentPage,
    totalPages,
    rangeStart: items.length === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + ADMIN_RESULTS_PAGE_SIZE, items.length),
  };
}
