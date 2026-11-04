import { beforeEach, describe, expect, it, vi } from "vitest";

// The sitemap's Shopify sources, swapped for fakes per test
const shopify = vi.hoisted(() => ({
  getCollections: vi.fn(),
  getPages: vi.fn(),
  getProductSitemapEntries: vi.fn(),
}));
vi.mock("lib/shopify", () => shopify);
vi.mock("lib/utils", () => ({
  baseUrl: "https://weskate.co",
  validateEnvironmentVariables: () => {},
}));

import sitemap from "./sitemap";

const BASE = "https://weskate.co";

beforeEach(() => {
  shopify.getCollections.mockResolvedValue([
    { handle: "", path: "/store", updatedAt: "2026-01-01" },
    { handle: "decks", path: "/store/decks", updatedAt: "2026-02-01" },
  ]);
  shopify.getProductSitemapEntries.mockResolvedValue([
    { handle: "deck-1", updatedAt: "2026-03-01" },
  ]);
  shopify.getPages.mockResolvedValue([
    { handle: "about-us", updatedAt: "2026-04-01" },
    { handle: "faq", updatedAt: "2026-05-01" },
  ]);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

const urls = async () => (await sitemap()).map((entry) => entry.url);

describe("sitemap", () => {
  it("lists every page in English and Hindi, linked as alternates", async () => {
    const entries = await sitemap();
    const english = entries.find((e) => e.url === `${BASE}/about-us`);
    const hindi = entries.find((e) => e.url === `${BASE}/hi/about-us`);
    const languages = {
      en: `${BASE}/about-us`,
      hi: `${BASE}/hi/about-us`,
      "x-default": `${BASE}/about-us`,
    };
    expect(english?.alternates?.languages).toEqual(languages);
    expect(hindi?.alternates?.languages).toEqual(languages);
  });

  it("uses the bare domain and /hi for the homepages", async () => {
    const all = await urls();
    expect(all).toContain(BASE);
    expect(all).toContain(`${BASE}/hi`);
    expect(all).not.toContain(`${BASE}/`);
    expect(all).not.toContain(`${BASE}/hi/`);
  });

  it("gives Shopify content its real update date and built-in pages none", async () => {
    const entries = await sitemap();
    const byUrl = (url: string) => entries.find((e) => e.url === url);
    expect(byUrl(`${BASE}/products/deck-1`)?.lastModified).toBe("2026-03-01");
    expect(byUrl(`${BASE}/store/decks`)?.lastModified).toBe("2026-02-01");
    expect(byUrl(`${BASE}/faq`)?.lastModified).toBe("2026-05-01");
    expect(byUrl(`${BASE}/contact`)).toBeDefined();
    expect(byUrl(`${BASE}/contact`)).not.toHaveProperty("lastModified");
  });

  it("lists each URL once, even when a Shopify page shares a built-in path", async () => {
    const all = await urls();
    expect(new Set(all).size).toBe(all.length);
    expect(all.filter((url) => url === `${BASE}/about-us`)).toHaveLength(1);
  });

  it("leaves out the synthetic All collection (/store covers it)", async () => {
    const all = await urls();
    expect(all.filter((url) => url === `${BASE}/store`)).toHaveLength(1);
  });

  it("keeps the rest of the sitemap when one Shopify source fails", async () => {
    shopify.getProductSitemapEntries.mockRejectedValue(new Error("throttled"));
    const all = await urls();
    expect(all).toContain(`${BASE}/contact`);
    expect(all).toContain(`${BASE}/store/decks`);
    expect(all).toContain(`${BASE}/faq`);
    expect(all.some((url) => url.includes("/products/"))).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});
