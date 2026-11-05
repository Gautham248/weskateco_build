import {
  ENQUIRY_REFERENCE_ALPHABET,
  ENQUIRY_REFERENCE_LENGTH,
  generateEnquiryId,
  newEnquiryReference,
} from "lib/contact/enquiry-reference";
import { describe, expect, it } from "vitest";

const REFERENCE_SHAPE = new RegExp(
  `^[${ENQUIRY_REFERENCE_ALPHABET}]{${ENQUIRY_REFERENCE_LENGTH}}$`,
);

describe("newEnquiryReference", () => {
  it("the default length is six characters", () => {
    expect(newEnquiryReference()).toHaveLength(ENQUIRY_REFERENCE_LENGTH);
  });

  it("every character comes from the reference alphabet", () => {
    for (const reference of Array.from({ length: 500 }, () =>
      newEnquiryReference(),
    )) {
      expect(reference).toMatch(REFERENCE_SHAPE);
    }
  });

  it.each("0O1IL".split(""))(
    "the alphabet omits every character a person could misread: %s",
    (character) => {
      expect(ENQUIRY_REFERENCE_ALPHABET).not.toContain(character);
    },
  );

  it("the whole alphabet is reachable, so no symbol is dead weight", () => {
    const drawn = Array.from({ length: 3000 }, () =>
      newEnquiryReference(),
    ).join("");

    for (const character of ENQUIRY_REFERENCE_ALPHABET.split("")) {
      expect(drawn).toContain(character);
    }
  });

  // A duplicate here would mean the generator is not random enough to be unique.
  it("200 draws are all distinct", () => {
    const drawn = Array.from({ length: 200 }, () => newEnquiryReference());

    expect(new Set(drawn).size).toBe(drawn.length);
  });

  it("a requested length is honoured", () => {
    expect(newEnquiryReference(10)).toHaveLength(10);
  });
});

describe("generateEnquiryId", () => {
  it("the date part is the UTC date, so the same instant is the same reference anywhere", () => {
    expect(
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
    ).toMatch(/^PRD-260924-/);
  });

  it("a late-in-the-day UTC instant is not rolled into the next day", () => {
    expect(
      generateEnquiryId("PRD", new Date("2026-12-31T23:59:00.000Z")),
    ).toMatch(/^PRD-261231-/);
  });

  it("the whole reference matches PREFIX-YYMMDD-XXXXXX", () => {
    expect(
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
    ).toMatch(/^PRD-\d{6}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
  });

  it("the caller's prefix is used verbatim", () => {
    expect(
      generateEnquiryId("SPAM", new Date("2026-09-24T07:45:21.871Z")),
    ).toMatch(/^SPAM-/);
  });

  it("two references generated in the same instant differ", () => {
    expect(
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
    ).not.toBe(generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")));
  });

  it("the reference is 17 characters, short enough to read aloud", () => {
    expect(
      generateEnquiryId("PRD", new Date("2026-09-24T07:45:21.871Z")),
    ).toHaveLength(17);
  });
});
