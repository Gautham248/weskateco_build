import { describe, expect, it } from "vitest";
import { isGoKwikCountry } from "./country";

describe("isGoKwikCountry", () => {
  it.each([
    ["country=IN", true],
    ["country=in", true],
    ["cartId=abc; country=IN; theme=dark", true],
    ["country=US", false],
    ["cartId=abc; country=GB", false],
  ])("%s -> %s", (cookies, expected) => {
    expect(isGoKwikCountry(cookies)).toBe(expected);
  });

  it("defaults to GoKwik when the country is unknown", () => {
    expect(isGoKwikCountry("")).toBe(true);
    expect(isGoKwikCountry("cartId=abc")).toBe(true);
    expect(isGoKwikCountry("country=")).toBe(true);
  });

  it("doesn't mistake other cookies ending in 'country' for it", () => {
    expect(isGoKwikCountry("shipping-country=US")).toBe(true);
  });
});
