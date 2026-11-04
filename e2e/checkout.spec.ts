import { expect, test, type Page } from "@playwright/test";
import {
  addFirstProductToCart,
  hasShopify,
  SHOPIFY_SKIP_REASON,
} from "./helpers";

// Checkout hands the Shopify cart to GoKwik's popup, which runs on GoKwik's
// domain. These tests cover our side of that handoff: GoKwik's SDK is
// replaced with a stand-in that records calls, so nothing reaches GoKwik and
// no payment is attempted.

test.skip(!hasShopify, SHOPIFY_SKIP_REASON);

const GOKWIK_SDK = "https://pdp.gokwik.co/**";

const GOKWIK_STUB = `
  window.__gokwikStub = { calls: [], handlers: {} };
  window.gokwikSdk = {
    on: function (event, handler) {
      (window.__gokwikStub.handlers[event] ||= []).push(handler);
    },
  };
  window.triggerGokwikCustomCheckout = function () {
    window.__gokwikStub.calls.push(JSON.parse(JSON.stringify(window.merchantInfo)));
  };
`;

type MerchantInfo = { cart?: { id: string }; environment?: string };

async function stubGokwik(page: Page) {
  // Install the stand-in before any page script runs, so the checkout hook
  // sees GoKwik as ready on mount instead of polling for it every 500ms
  await page.addInitScript(GOKWIK_STUB);
  await page.route(GOKWIK_SDK, (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
}

async function blockGokwik(page: Page) {
  await page.route(GOKWIK_SDK, (route) => route.abort());
}

/** Stops navigation to Shopify's own checkout and records where it went. */
async function interceptShopifyCheckout(page: Page) {
  const visited: string[] = [];
  await page.route(/\/cart\/c\/[^/?]+/, (route) => {
    visited.push(route.request().url());
    return route.fulfill({
      contentType: "text/html",
      body: "<h1>Shopify checkout (intercepted)</h1>",
    });
  });
  return visited;
}

/** The shopper left the site for the cart's Shopify checkout URL. */
async function expectShopifyCheckout(page: Page, visited: string[]) {
  await expect(page).toHaveURL(/\/cart\/c\//);
  expect(visited).toHaveLength(1);
  const appHost = new URL(test.info().project.use.baseURL!).host;
  expect(new URL(visited[0]!).host).not.toBe(appHost);
}

async function handoffs(page: Page): Promise<MerchantInfo[]> {
  return page.evaluate(
    () => (window as any).__gokwikStub?.calls ?? [],
  ) as Promise<MerchantInfo[]>;
}

async function cartIdCookie(page: Page): Promise<string> {
  const cookie = (await page.context().cookies()).find(
    (c) => c.name === "cartId",
  );
  expect(cookie, "adding to cart should set the cartId cookie").toBeTruthy();
  return decodeURIComponent(cookie!.value);
}

async function openCartDrawer(page: Page) {
  await page
    .getByRole("button", { name: "Open cart" })
    .filter({ visible: true })
    .first()
    .click();
  return page.getByRole("dialog");
}

async function addToCartOrSkip(page: Page) {
  const name = await addFirstProductToCart(page);
  test.skip(
    !name,
    "First product in the collection has no purchasable variant",
  );
}

test.describe("GoKwik checkout handoff", () => {
  test("cart page hands the Shopify cart to GoKwik", async ({ page }) => {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);

    await page.goto("/cart");
    await page
      .getByRole("button", { name: "Proceed to Checkout", exact: true })
      .click();

    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    const [merchantInfo] = await handoffs(page);
    expect(merchantInfo!.cart).toEqual({ id: cartId });
    expect(merchantInfo!.environment).toBeTruthy();
  });

  test("cart drawer hands off and resets when GoKwik's popup closes", async ({
    page,
  }) => {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);

    const drawer = await openCartDrawer(page);
    const checkout = drawer.getByRole("button", {
      name: "Proceed to Checkout",
      exact: true,
    });
    await expect(checkout).toBeEnabled();
    await checkout.click();

    await expect(
      drawer.getByRole("button", { name: "Processing...", exact: true }),
    ).toBeDisabled();
    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    expect((await handoffs(page))[0]!.cart).toEqual({ id: cartId });

    // Shopper closes GoKwik's popup without paying
    await page.evaluate(() =>
      (window as any).__gokwikStub.handlers.modal_closed?.forEach(
        (handler: () => void) => handler(),
      ),
    );
    await expect(checkout).toBeEnabled();
  });
});

test.describe("fallback to Shopify checkout when GoKwik doesn't load", () => {
  test("cart page sends the shopper to Shopify checkout", async ({ page }) => {
    await blockGokwik(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await addToCartOrSkip(page);

    await page.goto("/cart");
    await page
      .getByRole("button", { name: "Proceed to Checkout", exact: true })
      .click();

    await expectShopifyCheckout(page, shopifyCheckouts);
  });

  test("cart drawer switches to Shopify checkout after GoKwik times out", async ({
    page,
  }) => {
    // The checkout hook waits 15s for GoKwik's SDK before falling back
    test.slow();
    await blockGokwik(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await addToCartOrSkip(page);

    const drawer = await openCartDrawer(page);
    const checkout = drawer.getByRole("button", {
      name: "Proceed to Checkout",
      exact: true,
    });
    await expect(checkout).toBeEnabled({ timeout: 25_000 });
    await checkout.click();

    await expectShopifyCheckout(page, shopifyCheckouts);
  });
});
