import { describe, expect, it } from "vitest";
import {
  ADMIN_RESULTS_PAGE_SIZE,
  pageList,
  paginate,
} from "lib/admin/pagination";

function items(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

describe("pageList", () => {
  it("a single page lists just itself", () => {
    expect(pageList(1, 1)).toEqual([1]);
  });

  it("seven pages or fewer are all listed, with no gaps", () => {
    expect(pageList(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("eight pages introduces a trailing gap", () => {
    expect(pageList(1, 8)).toEqual([1, 2, "gap", 8]);
  });

  it("a middle page gets gaps on both sides", () => {
    expect(pageList(4, 10)).toEqual([1, "gap", 3, 4, 5, "gap", 10]);
  });

  it("the last page needs no trailing page after it", () => {
    expect(pageList(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("no entry ever falls outside 1..total", () => {
    for (const current of [1, 2, 5, 9, 10]) {
      for (const entry of pageList(current, 10)) {
        if (entry === "gap") continue;
        expect(entry).toBeGreaterThanOrEqual(1);
        expect(entry).toBeLessThanOrEqual(10);
      }
    }
  });

  it("a page number outside the range still yields a usable list", () => {
    const list = pageList(99, 10);

    expect(list.length).toBeGreaterThan(0);
    expect(list).not.toContain(99);
  });
});

describe("paginate", () => {
  const thirty = items(30);

  it("the first page holds a full page", () => {
    expect(paginate(thirty, 1)).toEqual({
      items: items(12),
      currentPage: 1,
      totalPages: 3,
      rangeStart: 1,
      rangeEnd: 12,
    });
  });

  it("the last page holds the remainder", () => {
    expect(paginate(thirty, 3)).toEqual({
      items: [25, 26, 27, 28, 29, 30],
      currentPage: 3,
      totalPages: 3,
      rangeStart: 25,
      rangeEnd: 30,
    });
  });

  it("an empty list is one empty page, not zero pages", () => {
    expect(paginate([], 1)).toEqual({
      items: [],
      currentPage: 1,
      totalPages: 1,
      rangeStart: 0,
      rangeEnd: 0,
    });
  });

  it("a page past the end clamps to the last page", () => {
    expect(paginate(thirty, 99)).toEqual({
      items: [25, 26, 27, 28, 29, 30],
      currentPage: 3,
      totalPages: 3,
      rangeStart: 25,
      rangeEnd: 30,
    });
  });

  it("a page before the start clamps to the first", () => {
    expect(paginate(thirty, 0).currentPage).toBe(1);
  });

  it("a result set that shrank below one page collapses to page 1", () => {
    expect(paginate(items(5), 2)).toEqual({
      items: items(5),
      currentPage: 1,
      totalPages: 1,
      rangeStart: 1,
      rangeEnd: 5,
    });
  });

  it("a count that divides evenly does not add a trailing page", () => {
    expect(paginate(items(24), 9).totalPages).toBe(2);
  });

  it("the page size is twelve", () => {
    expect(ADMIN_RESULTS_PAGE_SIZE).toBe(12);
  });

  it("the page size is actually what paginate slices by", () => {
    expect(paginate(items(ADMIN_RESULTS_PAGE_SIZE + 1), 1).items).toHaveLength(
      ADMIN_RESULTS_PAGE_SIZE,
    );
  });
});
