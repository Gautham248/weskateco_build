export const ADMIN_RESULTS_PAGE_SIZE = 12;

/**
 * The noun a pager counts. Kept as a pair rather than a string so pluralisation
 * is a lookup, not a suffix guess, and so the pager's wording is testable
 * without rendering it.
 */
export type ResultsNoun = {
  one: string;
  many: string;
};

export const PRODUCT_RESULTS_NOUN: ResultsNoun = {
  one: "product",
  many: "products",
};

/** Singular at exactly one, plural otherwise — zero included, as in "0 products". */
export function resultsNoun(
  count: number,
  noun: ResultsNoun = PRODUCT_RESULTS_NOUN,
): string {
  return count === 1 ? noun.one : noun.many;
}

/** The pager's aria-label, e.g. "Product pages" / "Enquiry pages". */
export function resultsNounLabel(
  noun: ResultsNoun = PRODUCT_RESULTS_NOUN,
): string {
  const word = noun.one;

  return `${word.charAt(0).toUpperCase()}${word.slice(1)} pages`;
}

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

export type AdminPageWindow = {
  currentPage: number;
  totalPages: number;
  offset: number;
  rangeStart: number;
  rangeEnd: number;
};

/**
 * Where a page of `total` rows starts and ends, with the requested page clamped
 * into range rather than trusted: a filter change — or a hand-edited `?page=99`
 * — can land outside a result set that was valid a moment ago.
 *
 * Shared by the in-memory pager below and by the enquiries tab, which pages in
 * SQL, so both agree on what "page 99 of 3" means.
 */
export function pageWindow(
  total: number,
  page: number,
  pageSize: number = ADMIN_RESULTS_PAGE_SIZE,
): AdminPageWindow {
  // Both arguments are guarded rather than trusted. `total` comes from a count
  // and `page` from the query string, and a non-finite value in either would
  // otherwise propagate NaN straight into a SQL offset.
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const requested = Number.isFinite(page) ? Math.floor(page) : 1;

  const totalPages = Math.max(1, Math.ceil(safeTotal / pageSize));
  const currentPage = Math.min(Math.max(requested, 1), totalPages);
  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    offset,
    rangeStart: safeTotal === 0 ? 0 : offset + 1,
    rangeEnd: Math.min(offset + pageSize, safeTotal),
  };
}

/**
 * Clamps the requested page into range rather than trusting the caller: a filter
 * change can shrink the result set out from under a page number that was valid
 * a moment ago.
 */
export function paginate<T>(items: T[], page: number): AdminPage<T> {
  const window = pageWindow(items.length, page);

  return {
    items: items.slice(window.offset, window.offset + ADMIN_RESULTS_PAGE_SIZE),
    currentPage: window.currentPage,
    totalPages: window.totalPages,
    rangeStart: window.rangeStart,
    rangeEnd: window.rangeEnd,
  };
}
