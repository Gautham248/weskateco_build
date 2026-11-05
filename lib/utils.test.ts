import { afterEach, describe, expect, it, vi } from "vitest";
import { isObject, isShopifyError } from "./type-guards";
import {
  createUrl,
  ensureStartsWith,
  validateEnvironmentVariables,
} from "./utils";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("createUrl", () => {
  it("appends search params when there are any", () => {
    expect(
      createUrl("/store", new URLSearchParams({ sort: "price-asc" })),
    ).toBe("/store?sort=price-asc");
  });

  it("returns the bare path when there are none", () => {
    expect(createUrl("/store", new URLSearchParams())).toBe("/store");
  });
});

describe("ensureStartsWith", () => {
  it("adds a missing prefix and leaves an existing one alone", () => {
    expect(ensureStartsWith("shop.myshopify.com", "https://")).toBe(
      "https://shop.myshopify.com",
    );
    expect(ensureStartsWith("https://shop.myshopify.com", "https://")).toBe(
      "https://shop.myshopify.com",
    );
  });
});

describe("baseUrl", () => {
  it("uses the Vercel production domain when set", async () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "weskate.co");
    const { baseUrl } = await import("./utils");
    expect(baseUrl).toBe("https://weskate.co");
  });

  it("falls back to localhost", async () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    const { baseUrl } = await import("./utils");
    expect(baseUrl).toBe("http://localhost:3000");
  });
});

describe("validateEnvironmentVariables", () => {
  it("passes when the Shopify variables are set", () => {
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "shop.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "token");
    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it("names every missing variable", () => {
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
    vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "");
    expect(() => validateEnvironmentVariables()).toThrow(
      /SHOPIFY_STORE_DOMAIN\nSHOPIFY_STOREFRONT_ACCESS_TOKEN/,
    );
  });

  it("rejects a store domain wrapped in brackets", () => {
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "[shop.myshopify.com]");
    vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "token");
    expect(() => validateEnvironmentVariables()).toThrow(/brackets/);
  });
});

describe("type guards", () => {
  it("isObject accepts plain objects only", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject("x")).toBe(false);
  });

  it("isShopifyError recognises errors and error subclasses", () => {
    class ShopifyError extends Error {}
    expect(isShopifyError(new Error("boom"))).toBe(true);
    expect(isShopifyError(new ShopifyError("boom"))).toBe(true);
    expect(isShopifyError({ status: 500, message: "boom" })).toBe(false);
    expect(isShopifyError("boom")).toBe(false);
  });
});
