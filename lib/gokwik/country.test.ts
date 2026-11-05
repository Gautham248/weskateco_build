import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("uses Shopify's checkout when the country is unknown", () => {
    expect(isGoKwikCountry("")).toBe(false);
    expect(isGoKwikCountry("cartId=abc")).toBe(false);
    expect(isGoKwikCountry("country=")).toBe(false);
  });

  it("doesn't mistake other cookies ending in 'country' for it", () => {
    expect(isGoKwikCountry("shipping-country=IN")).toBe(false);
  });

  describe("default country for local development", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("applies when the country is unknown in development", () => {
      vi.stubEnv("NODE_ENV", "development");
      vi.stubEnv("NEXT_PUBLIC_GOKWIK_DEFAULT_COUNTRY", "in");
      expect(isGoKwikCountry("")).toBe(true);
      // A real country still wins
      expect(isGoKwikCountry("country=US")).toBe(false);
    });

    it("is ignored in production builds", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("NEXT_PUBLIC_GOKWIK_DEFAULT_COUNTRY", "IN");
      expect(isGoKwikCountry("")).toBe(false);
    });
  });
});
