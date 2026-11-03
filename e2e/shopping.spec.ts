import { expect, test } from "@playwright/test";
import {
  canonicalPath,
  COLLECTION,
  hasShopify,
  addFirstProductToCart,
  openFirstProduct,
  productJsonLd,
  SHOPIFY_SKIP_REASON,
} from "./helpers";

test.skip(!hasShopify, SHOPIFY_SKIP_REASON);

test("homepage renders", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("main")).toBeVisible();
  expect(await canonicalPath(page)).toBe("/");
  // The Vercel template's welcome toast must not reach shoppers
  await expect(page.getByText(/Next\.js Commerce/)).toHaveCount(0);
  await expect(page).toHaveTitle(
    /^Buy Skateboards & Surfskates Online in India \| [^|]+$/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Born from busted decks and scraped knees\. Shop skateboards/,
  );
  // Exactly one H1, describing the store (hidden visually in the hero)
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "India's Home for Skateboards & Surfskates",
  );
});

test("collection page lists products and canonical drops sort", async ({
  page,
}) => {
  await page.goto(`/store/${COLLECTION}?sort=price-asc`);
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(
    page.locator('main a[href*="/products/"]').first(),
  ).toBeVisible();
  expect(await canonicalPath(page)).toBe(`/store/${COLLECTION}`);
});

test("product page has title, structured data and canonical", async ({
  page,
}) => {
  const handle = await openFirstProduct(page);

  const product = await productJsonLd(page);
  expect(product.name).toBeTruthy();
  expect(product.offers?.priceCurrency).toBeTruthy();
  await expect(page).toHaveTitle(/\S/);
  expect(await canonicalPath(page)).toBe(`/products/${handle}`);
});

test("unknown product is a not-found page search engines skip", async ({
  page,
}) => {
  const res = await page.goto("/products/e2e-this-product-does-not-exist");
  // A streamed (partially prerendered) page has sent its 200 status before the
  // product lookup fails, so Next marks it noindex instead of returning 404
  if (res?.status() !== 404) {
    expect(res?.status()).toBe(200);
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]'),
    ).toBeAttached();
  }
  await expect(page.getByText("This page could not be found")).toBeVisible();
});

test("add to cart shows the item in the cart", async ({ page }) => {
  const added = await addFirstProductToCart(page);
  test.skip(
    !added,
    "None of the first products in the collection can be bought",
  );
  const name = added!;

  // Leaving straight after the confirmation must not lose the item
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { level: 1, name: /my cart/i }),
  ).toBeVisible();
  // Each line renders twice (mobile and desktop layouts); one is display:none
  await expect(
    page.getByRole("heading", { name }).filter({ visible: true }),
  ).toHaveCount(1);
});

test("configurator loads", async ({ page }) => {
  const res = await page.goto("/configurator");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1").first()).toBeVisible();
});
