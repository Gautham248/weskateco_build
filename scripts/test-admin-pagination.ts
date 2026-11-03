import {
  ADMIN_RESULTS_PAGE_SIZE,
  pageList,
  paginate,
} from "lib/admin/pagination";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

function items(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

async function main() {
  console.log("\npageList");

  equal("a single page lists just itself", pageList(1, 1), [1]);
  equal(
    "seven pages or fewer are all listed, with no gaps",
    pageList(4, 7),
    [1, 2, 3, 4, 5, 6, 7],
  );
  equal("eight pages introduces a trailing gap", pageList(1, 8), [
    1,
    2,
    "gap",
    8,
  ]);
  equal("a middle page gets gaps on both sides", pageList(4, 10), [
    1,
    "gap",
    3,
    4,
    5,
    "gap",
    10,
  ]);
  equal("the last page needs no trailing page after it", pageList(10, 10), [
    1,
    "gap",
    9,
    10,
  ]);
  check(
    "no entry ever falls outside 1..total",
    [1, 2, 5, 9, 10].every((current) =>
      pageList(current, 10).every(
        (entry) => entry === "gap" || (entry >= 1 && entry <= 10),
      ),
    ),
  );
  check(
    "a page number outside the range still yields a usable list",
    (() => {
      const list = pageList(99, 10);
      return list.length > 0 && !list.includes(99);
    })(),
  );

  console.log("\npaginate");

  const thirty = items(30);

  equal("the first page holds a full page", paginate(thirty, 1), {
    items: items(12),
    currentPage: 1,
    totalPages: 3,
    rangeStart: 1,
    rangeEnd: 12,
  });
  equal("the last page holds the remainder", paginate(thirty, 3), {
    items: [25, 26, 27, 28, 29, 30],
    currentPage: 3,
    totalPages: 3,
    rangeStart: 25,
    rangeEnd: 30,
  });
  equal("an empty list is one empty page, not zero pages", paginate([], 1), {
    items: [],
    currentPage: 1,
    totalPages: 1,
    rangeStart: 0,
    rangeEnd: 0,
  });
  equal("a page past the end clamps to the last page", paginate(thirty, 99), {
    items: [25, 26, 27, 28, 29, 30],
    currentPage: 3,
    totalPages: 3,
    rangeStart: 25,
    rangeEnd: 30,
  });
  equal(
    "a page before the start clamps to the first",
    paginate(thirty, 0).currentPage,
    1,
  );
  equal(
    "a result set that shrank below one page collapses to page 1",
    paginate(items(5), 2),
    {
      items: items(5),
      currentPage: 1,
      totalPages: 1,
      rangeStart: 1,
      rangeEnd: 5,
    },
  );
  equal(
    "a count that divides evenly does not add a trailing page",
    paginate(items(24), 9).totalPages,
    2,
  );
  equal("the page size is twelve", ADMIN_RESULTS_PAGE_SIZE, 12);
  check(
    "the page size is actually what paginate slices by",
    paginate(items(ADMIN_RESULTS_PAGE_SIZE + 1), 1).items.length ===
      ADMIN_RESULTS_PAGE_SIZE,
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
