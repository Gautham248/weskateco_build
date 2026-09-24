import {
  ADMIN_RESULTS_PAGE_SIZE,
  pageWindow,
  resultsNoun,
  resultsNounLabel,
} from "lib/admin/pagination";
import {
  describeAnswers,
  describeMeta,
  ENQUIRY_REASON_FILTER_OPTIONS,
  isKnownReason,
  summariseEnquiry,
} from "lib/contact/enquiry-display";
import { ROUTES } from "lib/contact/routes";

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

const ENQUIRY_NOUN = { one: "enquiry", many: "enquiries" };

function main() {
  console.log("\ndescribeAnswers");

  equal(
    "reason fields come first, then shared fields, in the routing table's order",
    describeAnswers("product-info", {
      firstName: "Asha",
      productName: "Sphere Maneki Complete",
      category: "Skateboard decks",
      email: "asha@example.com",
    }).map((fact) => fact.key),
    ["category", "productName", "firstName", "email"],
  );

  equal(
    "labels come from the routing table rather than the raw key",
    describeAnswers("product-info", { productName: "Sphere Maneki Complete" }),
    [
      {
        key: "productName",
        label: "Product or brand name",
        value: "Sphere Maneki Complete",
      },
    ],
  );

  equal(
    "a key the routing table doesn't describe is still shown, labelled with its key",
    describeAnswers("product-info", { company_website: "http://spam.example" }),
    [
      {
        key: "company_website",
        label: "company_website",
        value: "http://spam.example",
      },
    ],
  );

  check(
    "every stored key surfaces exactly once",
    (() => {
      const keys = describeAnswers("product-info", {
        category: "Skateboard decks",
        productName: "Deck",
        firstName: "Asha",
        company_website: "http://spam.example",
        message: "Please confirm stock.",
      }).map((fact) => fact.key);

      return keys.length === 5 && new Set(keys).size === 5;
    })(),
  );

  equal(
    "a multi-select answer is joined instead of rendered as an array",
    describeAnswers("product-info", {
      queryType: ["Is it in stock", "Price, offers or EMI"],
    }).map((fact) => fact.value),
    ["Is it in stock, Price, offers or EMI"],
  );

  equal(
    "blank and null values are omitted",
    describeAnswers("product-info", {
      productName: "   ",
      category: "",
      pincode: null,
    }),
    [],
  );

  equal(
    "an unknown reason still describes the keys it was given",
    describeAnswers("no-such-reason", { anything: "still shown" }).length,
    1,
  );

  equal(
    "a null answers blob yields no facts",
    describeAnswers("product-info", null),
    [],
  );
  equal(
    "a string answers blob yields no facts",
    describeAnswers("product-info", "nope"),
    [],
  );
  equal(
    "an array answers blob yields no facts",
    describeAnswers("product-info", ["nope"]),
    [],
  );
  equal(
    "an undefined answers blob yields no facts",
    describeAnswers("product-info", undefined),
    [],
  );

  console.log("\ndescribeMeta");

  equal(
    "known provenance fields are labelled and ordered as declared",
    describeMeta({
      language: "en-GB",
      referrer: "https://weskateco.com/contact",
      submittedAt: "2026-09-24T07:45:21.871Z",
    }).map((fact) => fact.key),
    ["submittedAt", "referrer", "language"],
  );

  equal(
    "an all-null utm block is pruned rather than printed as JSON",
    describeMeta({
      submittedAt: "2026-09-24T07:45:21.871Z",
      utm: {
        source: null,
        medium: null,
        campaign: null,
        term: null,
        content: null,
      },
    }).map((fact) => fact.key),
    ["submittedAt"],
  );

  equal(
    "a populated utm block is shown, with the empty keys dropped",
    describeMeta({ utm: { source: "instagram", medium: null } }).map(
      (fact) => fact.value,
    ),
    ['{"source":"instagram"}'],
  );

  equal(
    "an unrecognised meta key is shown under its raw key",
    describeMeta({ whatever: "value" }),
    [{ key: "whatever", label: "whatever", value: "value" }],
  );

  equal("an undefined meta blob yields nothing", describeMeta(undefined), []);
  equal("a null meta blob yields nothing", describeMeta(null), []);

  console.log("\ndeeply nested values");

  // answers is stored unvalidated from a public endpoint, so a crafted submission can nest
  // arbitrarily deep. Walking it — or handing it to JSON.stringify — used to overflow the
  // stack and take the admin's page down with it.
  //
  // Measured, not guessed: the unbounded version of prune survives 200 levels and throws
  // RangeError from about 5,000, so 20,000 is the depth used here. A shallower fixture
  // would have passed against the broken code and proved nothing.
  const DEEP = 20_000;

  function nested(depth: number): Record<string, unknown> {
    let value: Record<string, unknown> = { leaf: "SECRET-LEAF" };

    for (let level = 0; level < depth; level += 1) {
      value = { nested: value };
    }

    return value;
  }

  check(
    "a 20,000-level answer renders instead of overflowing the stack",
    describeAnswers("product-info", { productName: nested(DEEP) }).length === 1,
  );

  check(
    "past the bound the value is marked, not walked",
    (() => {
      const first = describeAnswers("product-info", {
        productName: nested(DEEP),
      })[0];

      return (
        first !== undefined &&
        first.value.includes("nested value too deep to display")
      );
    })(),
  );

  check(
    "the deep leaf never reaches the render",
    describeAnswers("product-info", { productName: nested(DEEP) }).every(
      (fact) => !fact.value.includes("SECRET-LEAF"),
    ),
    "descending that far is the crash path, so the bound has to actually bound",
  );

  check(
    "a shallow object still renders in full",
    (() => {
      const first = describeAnswers("product-info", {
        productName: nested(2),
      })[0];

      return first !== undefined && first.value.includes("SECRET-LEAF");
    })(),
    "the bound must not start truncating ordinary values",
  );

  check(
    "describeMeta is bounded the same way",
    describeMeta({ utm: nested(DEEP) }).length === 1,
  );

  console.log("\nsummariseEnquiry");

  equal(
    "name, email and phone come back out of the blob",
    summariseEnquiry({
      firstName: "Asha",
      lastName: "Rao",
      email: "asha@example.com",
      phone: "+91 99999 99999",
    }),
    {
      name: "Asha Rao",
      email: "asha@example.com",
      phone: "+91 99999 99999",
    },
  );

  equal(
    "a missing name gives empty strings, never undefined",
    summariseEnquiry({ email: "asha@example.com" }),
    { name: "", email: "asha@example.com", phone: "" },
  );

  equal(
    "a first name with no surname has no trailing space",
    summariseEnquiry({ firstName: "Asha" }).name,
    "Asha",
  );

  equal(
    "a malformed blob gives empties rather than throwing",
    summariseEnquiry(null),
    { name: "", email: "", phone: "" },
  );

  console.log("\nisKnownReason");

  check("a real reason key passes", isKnownReason("product-info"));
  check("an unknown key fails", !isKnownReason("no-such-reason"));
  check("an empty string fails", !isKnownReason(""));
  check("undefined fails", !isKnownReason(undefined));
  check("a number fails", !isKnownReason(42));
  check(
    "the inherited 'constructor' key fails instead of matching ROUTES",
    !isKnownReason("constructor"),
  );
  check("'__proto__' fails", !isKnownReason("__proto__"));
  check(
    "every key in the routing table passes",
    Object.keys(ROUTES).every((reason) => isKnownReason(reason)),
  );

  console.log("\nENQUIRY_REASON_FILTER_OPTIONS");

  equal(
    "the filter opens with an explicit no-filter option",
    ENQUIRY_REASON_FILTER_OPTIONS[0],
    { value: "", label: "All reasons" },
  );

  check(
    "every reason the routing table knows is reachable from the filter",
    Object.keys(ROUTES).every((reason) =>
      ENQUIRY_REASON_FILTER_OPTIONS.some((option) => option.value === reason),
    ),
  );

  equal(
    "the filter offers no duplicate values",
    new Set(ENQUIRY_REASON_FILTER_OPTIONS.map((option) => option.value)).size,
    ENQUIRY_REASON_FILTER_OPTIONS.length,
  );

  console.log("\nresultsNoun");

  equal("one is singular", resultsNoun(1), "product");
  equal("zero is plural", resultsNoun(0), "products");
  equal("two is plural", resultsNoun(2), "products");
  equal(
    "a full page is plural",
    resultsNoun(ADMIN_RESULTS_PAGE_SIZE),
    "products",
  );
  equal("a custom noun is honoured", resultsNoun(3, ENQUIRY_NOUN), "enquiries");
  equal(
    "a custom singular is honoured",
    resultsNoun(1, ENQUIRY_NOUN),
    "enquiry",
  );

  equal(
    "the default aria-label is unchanged, so the product pickers keep theirs",
    resultsNounLabel(),
    "Product pages",
  );
  equal(
    "a custom aria-label is capitalised",
    resultsNounLabel(ENQUIRY_NOUN),
    "Enquiry pages",
  );

  console.log("\npageWindow");

  equal("the first page of three starts at offset zero", pageWindow(30, 1), {
    currentPage: 1,
    totalPages: 3,
    offset: 0,
    rangeStart: 1,
    rangeEnd: 12,
  });
  equal("the last page offsets to the remainder", pageWindow(30, 3), {
    currentPage: 3,
    totalPages: 3,
    offset: 24,
    rangeStart: 25,
    rangeEnd: 30,
  });
  equal("an empty result set is one empty page", pageWindow(0, 1), {
    currentPage: 1,
    totalPages: 1,
    offset: 0,
    rangeStart: 0,
    rangeEnd: 0,
  });
  equal(
    "a page past the end clamps to the last page rather than reading empty",
    pageWindow(30, 99),
    { currentPage: 3, totalPages: 3, offset: 24, rangeStart: 25, rangeEnd: 30 },
  );
  equal(
    "a page below the start clamps to the first",
    pageWindow(30, 0).currentPage,
    1,
  );
  equal(
    "a negative page clamps to the first",
    pageWindow(30, -5).currentPage,
    1,
  );
  equal(
    "a count dividing evenly adds no trailing page",
    pageWindow(24, 1).totalPages,
    2,
  );
  equal(
    "a NaN page clamps to the first instead of poisoning the offset",
    pageWindow(30, Number.NaN),
    { currentPage: 1, totalPages: 3, offset: 0, rangeStart: 1, rangeEnd: 12 },
  );
  equal(
    "a NaN total is treated as empty rather than NaN pages",
    pageWindow(Number.NaN, 1),
    { currentPage: 1, totalPages: 1, offset: 0, rangeStart: 0, rangeEnd: 0 },
  );
  equal("a fractional page is floored", pageWindow(30, 2.7).currentPage, 2);
  check(
    "the offset always lands on a page boundary",
    [1, 2, 3, 4].every(
      (page) => pageWindow(100, page).offset % ADMIN_RESULTS_PAGE_SIZE === 0,
    ),
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main();
