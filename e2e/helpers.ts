import { expect, type Page, type Request } from "@playwright/test";

// Pages backed by Shopify data only render when the store is reachable: either
// locally with credentials, or against a deployed site that has them
export const hasShopify = Boolean(
  (process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
    process.env.PLAYWRIGHT_BASE_URL,
);

export const SHOPIFY_SKIP_REASON =
  "Needs Shopify: set SHOPIFY_STORE_DOMAIN/SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local, or PLAYWRIGHT_BASE_URL";

// A collection that should always have products
export const COLLECTION = process.env.E2E_COLLECTION ?? "skateboards";

/** Path and query of the page's canonical URL (the host comes from the deploy env, so ignore it). */
export async function canonicalPath(page: Page): Promise<string> {
  const canonical = page.locator('link[rel="canonical"]');
  await expect(
    canonical.first(),
    "page should declare a canonical URL",
  ).toBeAttached();
  // A streamed page can briefly hold a second, identical copy of its metadata
  // in the browser (the server HTML has one), so require every copy to agree
  const hrefs = new Set(
    await canonical.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href")),
    ),
  );
  expect([...hrefs], "canonical URLs on the page should agree").toHaveLength(1);
  const url = new URL([...hrefs][0]!);
  return url.pathname + url.search;
}

/** Every JSON-LD item on the current page (a script may hold an array). */
export async function jsonLdItems(page: Page): Promise<Record<string, any>[]> {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return scripts.flatMap((text) => JSON.parse(text));
}

/** The JSON-LD item of a given schema.org type on the current page. */
export async function jsonLdOfType(
  page: Page,
  type: string,
): Promise<Record<string, any>> {
  const item = (await jsonLdItems(page)).find((data) => data["@type"] === type);
  expect(item, `page should include ${type} JSON-LD`).toBeTruthy();
  return item!;
}

/** Parsed Product JSON-LD from the current page. */
export async function productJsonLd(page: Page): Promise<Record<string, any>> {
  return jsonLdOfType(page, "Product");
}

/** Opens the first product in the test collection and returns its handle. */
export async function openFirstProduct(page: Page): Promise<string> {
  await page.goto(`/store/${COLLECTION}`);
  const firstProduct = page.locator('main a[href*="/products/"]').first();
  await expect(firstProduct).toBeVisible();
  const href = (await firstProduct.getAttribute("href"))!;
  await page.goto(href);
  await expect(page.locator("h1").first()).toBeVisible();
  return href.split("/products/")[1]!.split("?")[0]!;
}

/** Picks the first in-stock value for every option so a variant is selected. */
export async function selectFirstAvailableVariant(page: Page) {
  const optionGroups = page.locator("main dl");
  const count = await optionGroups.count();
  for (let i = 0; i < count; i++) {
    const group = optionGroups.nth(i);
    const choice = group.locator("dd button:not([disabled])").first();
    if ((await choice.count()) === 0) continue;
    const name = (await group.locator("dt").textContent())!
      .trim()
      .toLowerCase();
    const value = (await choice.textContent())!.trim();
    await choice.click();
    // Selecting an option writes it to the URL, which drives the variant
    // lookup. Compare the decoded parameter: names can contain spaces, and the
    // page already writes default options to the URL before any click.
    await expect
      .poll(() => new URL(page.url()).searchParams.get(name))
      .toBe(value);
  }
}

/**
 * Opens the first product in the test collection that can be bought: in stock
 * per its structured data, with an enabled Add To Cart button once an in-stock
 * variant is chosen. Returns its name, or null if none of the first few can.
 */
export async function openFirstPurchasableProduct(
  page: Page,
): Promise<string | null> {
  await page.goto(`/store/${COLLECTION}`);
  const links = page.locator('main a[href*="/products/"]');
  await expect(links.first()).toBeVisible();
  const hrefs = [
    ...new Set(
      await links.evaluateAll((els) =>
        els.map((el) => el.getAttribute("href")),
      ),
    ),
  ].filter((href): href is string => Boolean(href));

  for (const href of hrefs.slice(0, 12)) {
    await page.goto(href);
    const product = await productJsonLd(page);
    if (product.offers?.availability !== "https://schema.org/InStock") continue;

    // count() doesn't wait: a sold-out product has no Add To Cart button
    const addToCart = page.getByRole("button", { name: /^add to cart$/i });
    if ((await addToCart.count()) === 0) continue;
    if (await addToCart.first().isDisabled()) {
      await selectFirstAvailableVariant(page);
    }
    if (await addToCart.first().isEnabled()) return product.name;
  }
  return null;
}

/**
 * Adds the first purchasable product in the test collection to the cart and
 * waits for the server to save it. Returns the product name, or null when
 * none of the first few products can be bought.
 */
export async function addFirstProductToCart(
  page: Page,
): Promise<string | null> {
  const name = await openFirstPurchasableProduct(page);
  if (!name) return null;

  // Wait for the add-to-cart server action itself (its payload carries the
  // variant id). The UI's "Added to Cart" state only lasts two seconds and the
  // toast appears before the server has saved anything, so neither is a
  // reliable signal on a busy dev server.
  const isAddToCart = (req: Request) =>
    req.method() === "POST" &&
    "next-action" in req.headers() &&
    (req.postData() ?? "").includes("ProductVariant");
  const saved = page.waitForResponse((res) => isAddToCart(res.request()), {
    timeout: 60_000,
  });
  let sent = false;
  const onRequest = (req: Request) => {
    if (isAddToCart(req)) sent = true;
  };
  page.on("request", onRequest);
  // A click that lands before React hydrates the form does nothing, so click
  // again until the optimistic toast shows the page handled it. Once the add
  // has reached the server, only wait: another click would add a second one.
  await expect(async () => {
    if (!sent) {
      await page
        .getByRole("button", { name: /^add to cart$/i })
        .first()
        .click({ timeout: 2_000 });
    }
    await expect(page.getByText(/added to cart!/i).first()).toBeVisible({
      timeout: 2_000,
    });
  }).toPass({ timeout: 60_000 });
  page.off("request", onRequest);
  expect((await saved).ok()).toBe(true);
  await expect(
    page.getByText(/could not add to cart|error adding item/i),
  ).toHaveCount(0);
  return name;
}
