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
import { describe, expect, it } from "vitest";

const ENQUIRY_NOUN = { one: "enquiry", many: "enquiries" };

describe("describeAnswers", () => {
  it("reason fields come first, then shared fields, in the routing table's order", () => {
    expect(
      describeAnswers("product-info", {
        firstName: "Asha",
        productName: "Sphere Maneki Complete",
        category: "Skateboard decks",
        email: "asha@example.com",
      }).map((fact) => fact.key),
    ).toEqual(["category", "productName", "firstName", "email"]);
  });

  it("labels come from the routing table rather than the raw key", () => {
    expect(
      describeAnswers("product-info", {
        productName: "Sphere Maneki Complete",
      }),
    ).toEqual([
      {
        key: "productName",
        label: "Product or brand name",
        value: "Sphere Maneki Complete",
      },
    ]);
  });

  it("a key the routing table doesn't describe is still shown, labelled with its key", () => {
    expect(
      describeAnswers("product-info", {
        company_website: "http://spam.example",
      }),
    ).toEqual([
      {
        key: "company_website",
        label: "company_website",
        value: "http://spam.example",
      },
    ]);
  });

  it("every stored key surfaces exactly once", () => {
    const keys = describeAnswers("product-info", {
      category: "Skateboard decks",
      productName: "Deck",
      firstName: "Asha",
      company_website: "http://spam.example",
      message: "Please confirm stock.",
    }).map((fact) => fact.key);

    expect(keys).toHaveLength(5);
    expect(new Set(keys).size).toBe(5);
  });

  it("a multi-select answer is joined instead of rendered as an array", () => {
    expect(
      describeAnswers("product-info", {
        queryType: ["Is it in stock", "Price, offers or EMI"],
      }).map((fact) => fact.value),
    ).toEqual(["Is it in stock, Price, offers or EMI"]);
  });

  it("blank and null values are omitted", () => {
    expect(
      describeAnswers("product-info", {
        productName: "   ",
        category: "",
        pincode: null,
      }),
    ).toEqual([]);
  });

  it("an unknown reason still describes the keys it was given", () => {
    expect(
      describeAnswers("no-such-reason", { anything: "still shown" }),
    ).toHaveLength(1);
  });

  it("a null answers blob yields no facts", () => {
    expect(describeAnswers("product-info", null)).toEqual([]);
  });

  it("a string answers blob yields no facts", () => {
    expect(describeAnswers("product-info", "nope")).toEqual([]);
  });

  it("an array answers blob yields no facts", () => {
    expect(describeAnswers("product-info", ["nope"])).toEqual([]);
  });

  it("an undefined answers blob yields no facts", () => {
    expect(describeAnswers("product-info", undefined)).toEqual([]);
  });
});

describe("describeMeta", () => {
  it("known provenance fields are labelled and ordered as declared", () => {
    expect(
      describeMeta({
        language: "en-GB",
        referrer: "https://weskateco.com/contact",
        submittedAt: "2026-09-24T07:45:21.871Z",
      }).map((fact) => fact.key),
    ).toEqual(["submittedAt", "referrer", "language"]);
  });

  it("an all-null utm block is pruned rather than printed as JSON", () => {
    expect(
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
    ).toEqual(["submittedAt"]);
  });

  it("a populated utm block is shown, with the empty keys dropped", () => {
    expect(
      describeMeta({ utm: { source: "instagram", medium: null } }).map(
        (fact) => fact.value,
      ),
    ).toEqual(['{"source":"instagram"}']);
  });

  it("an unrecognised meta key is shown under its raw key", () => {
    expect(describeMeta({ whatever: "value" })).toEqual([
      { key: "whatever", label: "whatever", value: "value" },
    ]);
  });

  it("an undefined meta blob yields nothing", () => {
    expect(describeMeta(undefined)).toEqual([]);
  });

  it("a null meta blob yields nothing", () => {
    expect(describeMeta(null)).toEqual([]);
  });
});

describe("deeply nested values", () => {
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

  it("a 20,000-level answer renders instead of overflowing the stack", () => {
    expect(
      describeAnswers("product-info", { productName: nested(DEEP) }),
    ).toHaveLength(1);
  });

  it("past the bound the value is marked, not walked", () => {
    const first = describeAnswers("product-info", {
      productName: nested(DEEP),
    })[0];

    expect(first).toBeDefined();
    expect(first?.value).toContain("nested value too deep to display");
  });

  it("the marker is carried structurally, not only as text", () => {
    expect(
      describeAnswers("product-info", { productName: nested(DEEP) })[0]
        ?.truncated,
    ).toBe(true);
  });

  // The rule the flag exists for. `answers` is unvalidated, so a submitter can send the
  // marker text verbatim, and it has to read as something they typed rather than as
  // truncation the panel performed.
  it("a stored value equal to the marker is not reported as truncation", () => {
    expect(
      describeAnswers("product-info", {
        productName: "[nested value too deep to display]",
      })[0]?.truncated,
    ).toBeUndefined();
  });

  it("a stored object shaped like the marker is not reported as truncation", () => {
    expect(
      describeAnswers("product-info", {
        productName: { truncated: true },
      })[0]?.truncated,
    ).toBeUndefined();
  });

  it("an ordinary shallow value is never reported as truncation", () => {
    expect(
      describeAnswers("product-info", { productName: "Sphere Heavy" })[0]
        ?.truncated,
    ).toBeUndefined();
  });

  // Descending that far is the crash path, so the bound has to actually bound.
  it("the deep leaf never reaches the render", () => {
    for (const fact of describeAnswers("product-info", {
      productName: nested(DEEP),
    })) {
      expect(fact.value).not.toContain("SECRET-LEAF");
    }
  });

  // The bound must not start truncating ordinary values.
  it("a shallow object still renders in full", () => {
    const first = describeAnswers("product-info", {
      productName: nested(2),
    })[0];

    expect(first).toBeDefined();
    expect(first?.value).toContain("SECRET-LEAF");
  });

  it("describeMeta is bounded the same way", () => {
    expect(describeMeta({ utm: nested(DEEP) })).toHaveLength(1);
  });
});

describe("summariseEnquiry", () => {
  it("name, email and phone come back out of the blob", () => {
    expect(
      summariseEnquiry({
        firstName: "Asha",
        lastName: "Rao",
        email: "asha@example.com",
        phone: "+91 99999 99999",
      }),
    ).toEqual({
      name: "Asha Rao",
      email: "asha@example.com",
      phone: "+91 99999 99999",
    });
  });

  it("a missing name gives empty strings, never undefined", () => {
    expect(summariseEnquiry({ email: "asha@example.com" })).toEqual({
      name: "",
      email: "asha@example.com",
      phone: "",
    });
  });

  it("a first name with no surname has no trailing space", () => {
    expect(summariseEnquiry({ firstName: "Asha" }).name).toBe("Asha");
  });

  it("a malformed blob gives empties rather than throwing", () => {
    expect(summariseEnquiry(null)).toEqual({ name: "", email: "", phone: "" });
  });
});

describe("isKnownReason", () => {
  it("a real reason key passes", () => {
    expect(isKnownReason("product-info")).toBe(true);
  });

  it("an unknown key fails", () => {
    expect(isKnownReason("no-such-reason")).toBe(false);
  });

  it("an empty string fails", () => {
    expect(isKnownReason("")).toBe(false);
  });

  it("undefined fails", () => {
    expect(isKnownReason(undefined)).toBe(false);
  });

  it("a number fails", () => {
    expect(isKnownReason(42)).toBe(false);
  });

  it("the inherited 'constructor' key fails instead of matching ROUTES", () => {
    expect(isKnownReason("constructor")).toBe(false);
  });

  it("'__proto__' fails", () => {
    expect(isKnownReason("__proto__")).toBe(false);
  });

  it.each(Object.keys(ROUTES))(
    "every key in the routing table passes: %s",
    (reason) => {
      expect(isKnownReason(reason)).toBe(true);
    },
  );
});

describe("ENQUIRY_REASON_FILTER_OPTIONS", () => {
  it("the filter opens with an explicit no-filter option", () => {
    expect(ENQUIRY_REASON_FILTER_OPTIONS[0]).toEqual({
      value: "",
      label: "All reasons",
    });
  });

  it("every reason the routing table knows is reachable from the filter", () => {
    const values = ENQUIRY_REASON_FILTER_OPTIONS.map((option) => option.value);

    expect(values).toEqual(expect.arrayContaining(Object.keys(ROUTES)));
  });

  it("the filter offers no duplicate values", () => {
    expect(
      new Set(ENQUIRY_REASON_FILTER_OPTIONS.map((option) => option.value)).size,
    ).toBe(ENQUIRY_REASON_FILTER_OPTIONS.length);
  });
});

describe("resultsNoun", () => {
  it("one is singular", () => {
    expect(resultsNoun(1)).toBe("product");
  });

  it("zero is plural", () => {
    expect(resultsNoun(0)).toBe("products");
  });

  it("two is plural", () => {
    expect(resultsNoun(2)).toBe("products");
  });

  it("a full page is plural", () => {
    expect(resultsNoun(ADMIN_RESULTS_PAGE_SIZE)).toBe("products");
  });

  it("a custom noun is honoured", () => {
    expect(resultsNoun(3, ENQUIRY_NOUN)).toBe("enquiries");
  });

  it("a custom singular is honoured", () => {
    expect(resultsNoun(1, ENQUIRY_NOUN)).toBe("enquiry");
  });

  it("the default aria-label is unchanged, so the product pickers keep theirs", () => {
    expect(resultsNounLabel()).toBe("Product pages");
  });

  it("a custom aria-label is capitalised", () => {
    expect(resultsNounLabel(ENQUIRY_NOUN)).toBe("Enquiry pages");
  });
});

describe("pageWindow", () => {
  it("the first page of three starts at offset zero", () => {
    expect(pageWindow(30, 1)).toEqual({
      currentPage: 1,
      totalPages: 3,
      offset: 0,
      rangeStart: 1,
      rangeEnd: 12,
    });
  });

  it("the last page offsets to the remainder", () => {
    expect(pageWindow(30, 3)).toEqual({
      currentPage: 3,
      totalPages: 3,
      offset: 24,
      rangeStart: 25,
      rangeEnd: 30,
    });
  });

  it("an empty result set is one empty page", () => {
    expect(pageWindow(0, 1)).toEqual({
      currentPage: 1,
      totalPages: 1,
      offset: 0,
      rangeStart: 0,
      rangeEnd: 0,
    });
  });

  it("a page past the end clamps to the last page rather than reading empty", () => {
    expect(pageWindow(30, 99)).toEqual({
      currentPage: 3,
      totalPages: 3,
      offset: 24,
      rangeStart: 25,
      rangeEnd: 30,
    });
  });

  it("a page below the start clamps to the first", () => {
    expect(pageWindow(30, 0).currentPage).toBe(1);
  });

  it("a negative page clamps to the first", () => {
    expect(pageWindow(30, -5).currentPage).toBe(1);
  });

  it("a count dividing evenly adds no trailing page", () => {
    expect(pageWindow(24, 1).totalPages).toBe(2);
  });

  it("a NaN page clamps to the first instead of poisoning the offset", () => {
    expect(pageWindow(30, Number.NaN)).toEqual({
      currentPage: 1,
      totalPages: 3,
      offset: 0,
      rangeStart: 1,
      rangeEnd: 12,
    });
  });

  it("a NaN total is treated as empty rather than NaN pages", () => {
    expect(pageWindow(Number.NaN, 1)).toEqual({
      currentPage: 1,
      totalPages: 1,
      offset: 0,
      rangeStart: 0,
      rangeEnd: 0,
    });
  });

  it("a fractional page is floored", () => {
    expect(pageWindow(30, 2.7).currentPage).toBe(2);
  });

  it.each([1, 2, 3, 4])(
    "the offset always lands on a page boundary: page %i",
    (page) => {
      expect(pageWindow(100, page).offset % ADMIN_RESULTS_PAGE_SIZE).toBe(0);
    },
  );
});
