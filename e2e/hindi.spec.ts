import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { COLLECTION, hasShopify, SHOPIFY_SKIP_REASON } from "./helpers";

// The Hindi storefront under /hi. Product and collection copy comes from
// Shopify's translations, which a store may not have published, so these
// tests check the site's own text (locales/hi.json) rather than product names.

const english: Record<string, string> = JSON.parse(
  readFileSync("locales/en.json", "utf8"),
);
const hindi: Record<string, string> = JSON.parse(
  readFileSync("locales/hi.json", "utf8"),
);

const DEVANAGARI = /[ऀ-ॿ]/;

// Paths the storefront deliberately doesn't prefix (see localizeHref)
const UNLOCALIZED =
  /^\/(account|services|api|admin|studio|_next|fonts|hero|icons)(\/|$)|\.[a-z0-9]+$/i;

const PAGES = [
  "/",
  "/store",
  `/store/${COLLECTION}`,
  "/cart",
  "/privacy-policy",
  "/refund-policy",
  "/shipping-policy",
  "/terms-of-service",
];

const hindiPath = (path: string) => (path === "/" ? "/hi" : `/hi${path}`);

/** The first product in the test collection, opened in Hindi. */
async function openHindiProduct(page: Page): Promise<string> {
  await page.goto(`/hi/store/${COLLECTION}`);
  const product = page.locator('main a[href*="/products/"]').first();
  await expect(product).toBeVisible();
  const href = (await product.getAttribute("href"))!;
  expect(href, "product links on /hi keep the prefix").toMatch(
    /^\/hi\/products\//,
  );
  await page.goto(href);
  await expect(page.locator("h1").first()).toBeVisible();
  return href.split("?")[0]!.replace(/^\/hi/, "");
}

/** Dictionary keys showing on the page: what a missing translation looks like. */
async function rawKeysOnPage(page: Page): Promise<string[]> {
  const text = await page.locator("body").innerText();
  return Object.keys(english).filter((key) =>
    new RegExp(`(^|[^\\w.])${key.replace(/\./g, "\\.")}(?![\\w.])`).test(text),
  );
}

/** Root-relative links on the page that would drop a Hindi shopper into English. */
async function linksLeavingHindi(page: Page): Promise<string[]> {
  const hrefs = await page
    .locator('a[href^="/"]:not([hreflang="en"])')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")!));
  return [
    ...new Set(
      hrefs.filter((href) => {
        if (href.startsWith("//")) return false;
        const path = href.split(/[?#]/)[0]!;
        return !(
          path === "/hi" ||
          path.startsWith("/hi/") ||
          UNLOCALIZED.test(path)
        );
      }),
    ),
  ];
}

async function alternatePath(page: Page, hreflang: string) {
  const href = await page
    .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
    .first()
    .getAttribute("href");
  return href ? new URL(href, page.url()).pathname : null;
}

test.describe("Hindi pages", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  // Content checks don't depend on the viewport
  test.skip(({ isMobile }) => isMobile, "Checked on desktop");

  for (const route of PAGES) {
    const path = hindiPath(route);

    test(`${path} is in Hindi`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", "hi");
      await expect(page.locator("nav").first()).toContainText(DEVANAGARI);
      await expect(page.locator("main").first()).toContainText(DEVANAGARI);
      expect(await rawKeysOnPage(page), "untranslated keys").toEqual([]);
      expect(await linksLeavingHindi(page), "links without /hi").toEqual([]);
    });
  }

  for (const route of PAGES.filter((path) => path !== "/cart")) {
    const path = hindiPath(route);

    test(`${path} links its English version`, async ({ page }) => {
      await page.goto(path);
      expect(await alternatePath(page, "en")).toBe(route);
      expect(await alternatePath(page, "hi")).toBe(path);
      expect(await alternatePath(page, "x-default")).toBe(route);
    });
  }

  test("a product page is in Hindi", async ({ page }) => {
    const route = await openHindiProduct(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    // The buy button, whether or not the product is in stock
    const buy = new RegExp(
      `^(${hindi["product.add_to_cart"]}|${hindi["product.out_of_stock"]})$`,
    );
    await expect(page.getByRole("button", { name: buy }).first()).toBeVisible();
    expect(await rawKeysOnPage(page), "untranslated keys").toEqual([]);
    expect(await linksLeavingHindi(page), "links without /hi").toEqual([]);
    expect(await alternatePath(page, "en")).toBe(route);
  });

  test("English pages stay in English", async ({ page }) => {
    await page.goto("/store");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("nav").first()).not.toContainText(DEVANAGARI);
    expect(await alternatePath(page, "hi")).toBe("/hi/store");
  });
});

test.describe("switching language", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);

  test("the header dropdown keeps the page and its query string", async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(isMobile, "The dropdown is in the tablet and desktop header");

    await page.goto("/hi/store?sort=price-asc");
    await page
      .getByRole("button", { name: new RegExp(`^${hindi["nav.language"]}:`) })
      .click();
    await page.getByRole("menuitem", { name: "English" }).click();
    await page.waitForURL(/\/store\?sort=price-asc$/);
    expect(new URL(page.url()).pathname).toBe("/store");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page
      .getByRole("button", { name: new RegExp(`^${english["nav.language"]}:`) })
      .click();
    await page.getByRole("menuitem", { name: "हिन्दी" }).click();
    await page.waitForURL(/\/hi\/store\?sort=price-asc$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    // The proxy records the choice so a new cart checks out in Hindi
    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === "locale")?.value).toBe(
      "hi",
    );
  });

  test("the mobile menu switches language", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The language row is in the mobile menu");

    await page.goto("/hi/store?sort=price-asc");
    await page
      .getByRole("button", { name: hindi["nav.open_mobile_menu"] })
      .click();
    await page.getByRole("link", { name: "English", exact: true }).click();
    await page.waitForURL(/\/store\?sort=price-asc$/);
    expect(new URL(page.url()).pathname).toBe("/store");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("internal links on /hi stay in Hindi", async ({ page, isMobile }) => {
    test.skip(isMobile, "Checked on desktop");

    await page.goto("/hi");
    const academy = page.locator('a[href="/hi/academy"]').first();
    await expect(academy).toBeAttached();
    await page.goto((await academy.getAttribute("href"))!);
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });
});

test.describe("policy translations", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  test.skip(({ isMobile }) => isMobile, "Checked on desktop");

  test("the Hindi policy says the English version applies, and links it", async ({
    page,
  }) => {
    await page.goto("/hi/refund-policy");
    await expect(
      page.getByText(hindi["legal.translation_notice"]!),
    ).toBeVisible();

    const link = page.getByRole("link", { name: hindi["legal.read_english"] });
    await expect(link).toHaveAttribute("href", "/refund-policy");
    await link.click();
    await page.waitForURL(/\/refund-policy$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the English policy has no translation notice", async ({ page }) => {
    await page.goto("/refund-policy");
    await expect(page.locator("main")).toContainText(/refund/i);
    await expect(
      page.getByText(english["legal.translation_notice"]!),
    ).toHaveCount(0);
    await expect(
      page.getByText(hindi["legal.translation_notice"]!),
    ).toHaveCount(0);
  });
});
