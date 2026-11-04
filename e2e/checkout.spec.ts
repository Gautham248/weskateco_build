import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  addFirstProductToCart,
  hasShopify,
  openFirstPurchasableProduct,
  SHOPIFY_SKIP_REASON,
} from "./helpers";

// Checkout hands the Shopify cart to GoKwik's popup, which runs on GoKwik's
// domain. These tests cover our side of that handoff: GoKwik's SDK script is
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

/** Serves the stand-in in place of GoKwik's SDK, optionally slowly. */
async function stubGokwik(page: Page, { delayMs = 0 } = {}) {
  await page.route(GOKWIK_SDK, async (route) => {
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({
      contentType: "application/javascript",
      // Stop the browser reusing it from cache, so every page load waits
      headers: { "Cache-Control": "no-store" },
      body: GOKWIK_STUB,
    });
  });
}

/** A GoKwik SDK that loads but whose checkout fails to open. */
async function brokenGokwik(page: Page) {
  await page.route(GOKWIK_SDK, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      headers: { "Cache-Control": "no-store" },
      body: `${GOKWIK_STUB}
        window.triggerGokwikCustomCheckout = function () {
          throw new Error("GoKwik checkout failed to open");
        };`,
    }),
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

async function cookieValue(page: Page, name: string) {
  const cookie = (await page.context().cookies()).find((c) => c.name === name);
  return cookie && decodeURIComponent(cookie.value);
}

/**
 * Where /cart/checkout sends the shopper, with this page's cookies. The
 * redirect is read rather than followed: the dev store's checkout sits
 * behind its storefront password.
 */
async function cartCheckoutRedirect(page: Page): Promise<string> {
  const res = await page.request.get("/cart/checkout", { maxRedirects: 0 });
  expect(res.status()).toBe(303);
  return res.headers()["location"]!;
}

/** Posts a message to the page as if from `origin` (GoKwik's checkout frame). */
async function postMessageFrom(page: Page, origin: string, data: unknown) {
  await page.evaluate(
    ([origin, data]) =>
      window.dispatchEvent(new MessageEvent("message", { origin, data })),
    [origin, data] as const,
  );
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

const checkoutButton = (scope: Page | Locator, name: string) =>
  scope.getByRole("button", { name, exact: true });

/** Records every request to GoKwik's servers. */
function recordGokwikRequests(page: Page) {
  const requests: string[] = [];
  page.on("request", (req) => {
    if (new URL(req.url()).host === "pdp.gokwik.co") requests.push(req.url());
  });
  return requests;
}

/**
 * Opens a product that can be bought and clicks Buy Now, which makes a
 * one-item cart on the server and then opens checkout for it.
 */
async function buyNow(page: Page) {
  const name = await openFirstPurchasableProduct(page);
  test.skip(
    !name,
    "None of the first products in the collection can be bought",
  );

  // A click before React hydrates the page does nothing, so click until the
  // server action that makes the cart is sent
  const buyNowButton = checkoutButton(page, "Buy Now")
    .filter({ visible: true })
    .first();
  await expect(async () => {
    const cartRequest = page.waitForRequest(
      (req) => req.method() === "POST" && "next-action" in req.headers(),
      { timeout: 2_000 },
    );
    await buyNowButton.click({ timeout: 2_000 });
    await cartRequest;
  }).toPass({ timeout: 30_000 });
}

// GoKwik is only offered to shoppers known to be in India. In production the
// proxy sets this cookie from Vercel's geolocation; locally there's no
// geolocation header, so the proxy leaves a test-set cookie alone. Tests for
// other countries override it.
test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([{ name: "country", value: "IN", url: baseURL! }]);
});

test.describe("GoKwik checkout handoff", () => {
  test("cart page hands the Shopify cart to GoKwik", async ({ page }) => {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);

    await page.goto("/cart");
    await checkoutButton(page, "Proceed to Checkout").click();

    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    const [merchantInfo] = await handoffs(page);
    expect(merchantInfo!.cart).toEqual({ id: cartId });
    expect(merchantInfo!.environment).toBeTruthy();
    await expect(checkoutButton(page, "Processing...")).toBeDisabled();
    // Shoppers in India are offered Snapmint EMI
    await expect(
      page.getByRole("button", { name: /Buy on EMI/i }).first(),
    ).toBeVisible();
  });

  test("cart page waits for GoKwik instead of skipping to Shopify", async ({
    page,
  }) => {
    // A slow GoKwik script used to send quick clicks to Shopify's checkout.
    // Now a click while it loads waits for it (up to 5s), like Buy Now.
    await stubGokwik(page, { delayMs: 2500 });
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await addToCartOrSkip(page);

    // Don't wait for the load event: it would also wait for GoKwik's script
    await page.goto("/cart", { waitUntil: "domcontentloaded" });
    const proceed = checkoutButton(page, "Proceed to Checkout");
    await expect(proceed).toBeEnabled();

    // A click before React hydrates does nothing, so click until one lands.
    // A click that is waiting for GoKwik relabels the button, so it isn't
    // clicked twice.
    await expect(async () => {
      if ((await handoffs(page)).length === 0) {
        await proceed.click({ timeout: 1_000 }).catch(() => {});
      }
      expect(await handoffs(page)).toHaveLength(1);
    }).toPass({ timeout: 20_000 });
    expect(shopifyCheckouts).toEqual([]);
  });

  test("cart drawer hands off and resets when GoKwik's popup closes", async ({
    page,
  }) => {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);

    const drawer = await openCartDrawer(page);
    const checkout = checkoutButton(drawer, "Proceed to Checkout");
    await expect(checkout).toBeEnabled();
    await checkout.click();

    await expect(checkoutButton(drawer, "Processing...")).toBeDisabled();
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

  test("Buy Now hands a new one-item cart to GoKwik", async ({ page }) => {
    await stubGokwik(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await buyNow(page);

    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    const [merchantInfo] = await handoffs(page);
    expect(merchantInfo!.cart?.id).toMatch(/^gid:\/\/shopify\/Cart\//);
    expect(shopifyCheckouts).toEqual([]);
  });
});

test.describe("shoppers outside India", () => {
  // GoKwik is only set up for India. In production the proxy sets this
  // cookie from Vercel's geolocation; locally there's no geolocation header,
  // so the proxy leaves a test-set cookie alone.
  test.beforeEach(async ({ context, baseURL }) => {
    await context.addCookies([{ name: "country", value: "US", url: baseURL! }]);
  });

  for (const where of ["cart page", "cart drawer"] as const) {
    test(`${where} goes straight to Shopify checkout without loading GoKwik`, async ({
      page,
    }) => {
      const gokwikRequests = recordGokwikRequests(page);
      const shopifyCheckouts = await interceptShopifyCheckout(page);
      await addToCartOrSkip(page);

      let scope: Page | Locator = page;
      if (where === "cart page") {
        await page.goto("/cart");
      } else {
        scope = await openCartDrawer(page);
      }

      // Ready at once, not after the 15s wait for GoKwik
      const checkout = checkoutButton(scope, "Proceed to Checkout");
      await expect(checkout).toBeEnabled({ timeout: 5_000 });
      await checkout.click();

      await expectShopifyCheckout(page, shopifyCheckouts);
      expect(gokwikRequests).toEqual([]);
    });
  }

  test("Buy Now goes straight to Shopify checkout", async ({ page }) => {
    const gokwikRequests = recordGokwikRequests(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await buyNow(page);

    // Without waiting for GoKwik (that wait is 5s)
    await expect(page).toHaveURL(/\/cart\/c\//, { timeout: 4_000 });
    await expectShopifyCheckout(page, shopifyCheckouts);
    expect(gokwikRequests).toEqual([]);
  });

  test("Snapmint EMI offers are hidden", async ({ page }) => {
    await addToCartOrSkip(page);
    await expect(page.getByText(/Buy on EMI/i)).toHaveCount(0);

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /my cart/i })).toBeVisible();
    await expect(page.getByText(/Buy on EMI/i)).toHaveCount(0);
  });
});

test.describe("shoppers whose country isn't known", () => {
  // Vercel couldn't locate them: Shopify's checkout works from anywhere,
  // while GoKwik's popup opens blank outside India
  test.beforeEach(async ({ context }) => {
    await context.clearCookies({ name: "country" });
  });

  test("go straight to Shopify checkout without loading GoKwik", async ({
    page,
  }) => {
    const gokwikRequests = recordGokwikRequests(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await addToCartOrSkip(page);

    await page.goto("/cart");
    const checkout = checkoutButton(page, "Proceed to Checkout");
    await expect(checkout).toBeEnabled({ timeout: 5_000 });
    await checkout.click();

    await expectShopifyCheckout(page, shopifyCheckouts);
    expect(gokwikRequests).toEqual([]);
    expect(
      (await page.context().cookies()).some((c) => c.name === "country"),
    ).toBe(false);
  });
});

test.describe("fallback to Shopify checkout when GoKwik doesn't load", () => {
  // A checkout click waits up to 5s for GoKwik, then uses Shopify's checkout
  test.slow();

  for (const where of ["cart page", "cart drawer"] as const) {
    test(`${where} switches to Shopify checkout after GoKwik times out`, async ({
      page,
    }) => {
      await blockGokwik(page);
      const shopifyCheckouts = await interceptShopifyCheckout(page);
      await addToCartOrSkip(page);

      let scope: Page | Locator = page;
      if (where === "cart page") {
        await page.goto("/cart");
      } else {
        scope = await openCartDrawer(page);
      }

      // Usable straight away, not after the 15s wait for GoKwik
      const checkout = checkoutButton(scope, "Proceed to Checkout");
      await expect(checkout).toBeEnabled({ timeout: 5_000 });
      await checkout.click();
      await expect(checkoutButton(scope, "Loading checkout...")).toBeDisabled();

      // Shopify's checkout after the 5s wait, not the hook's 15s timeout
      await expect(page).toHaveURL(/\/cart\/c\//, { timeout: 9_000 });
      await expectShopifyCheckout(page, shopifyCheckouts);
    });
  }

  test("Buy Now switches to Shopify checkout after GoKwik times out", async ({
    page,
  }) => {
    await blockGokwik(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await buyNow(page);
    await expectShopifyCheckout(page, shopifyCheckouts);
  });
});

test.describe("when checkout can't start normally", () => {
  test("GoKwik's own fallback URL, /cart/checkout, reaches Shopify checkout", async ({
    page,
  }) => {
    // GoKwik's script sends shoppers to /cart/checkout when it decides it
    // can't run. That's a Shopify theme URL, so the site has to answer it.
    await addToCartOrSkip(page);
    const location = await cartCheckoutRedirect(page);
    expect(location).toMatch(/\/cart\/c\//);
    expect(new URL(location).host).not.toBe(
      new URL(test.info().project.use.baseURL!).host,
    );
  });

  test("/cart/checkout uses the one-item cart Buy Now handed to GoKwik", async ({
    page,
  }) => {
    await stubGokwik(page);
    await buyNow(page);
    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    const buyNowCart = (await handoffs(page))[0]!.cart!.id;

    // Shopify's checkout URL carries the cart's token: gid://shopify/Cart/<token>
    const token = buyNowCart.split("/").pop()!.split("?")[0]!;
    expect(await cartCheckoutRedirect(page)).toContain(`/cart/c/${token}`);
  });

  test("/cart/checkout without a cart goes to the cart page", async ({
    page,
  }) => {
    await page.goto("/cart/checkout");
    await expect(page).toHaveURL(/\/cart$/);
  });

  test("the cart page uses Shopify checkout when GoKwik's checkout won't open", async ({
    page,
  }) => {
    await brokenGokwik(page);
    const shopifyCheckouts = await interceptShopifyCheckout(page);
    await addToCartOrSkip(page);

    await page.goto("/cart");
    await checkoutButton(page, "Proceed to Checkout").click();
    await expectShopifyCheckout(page, shopifyCheckouts);
  });

  test("Buy Now tells the shopper when it can't start checkout", async ({
    page,
  }) => {
    const name = await openFirstPurchasableProduct(page);
    test.skip(
      !name,
      "None of the first products in the collection can be bought",
    );

    // The server action that makes the one-item cart fails (network error)
    await page.route("**/*", (route) =>
      route.request().method() === "POST" &&
      "next-action" in route.request().headers()
        ? route.abort()
        : route.fallback(),
    );
    const buyNowButton = checkoutButton(page, "Buy Now")
      .filter({ visible: true })
      .first();
    // Clicks before React hydrates the page do nothing, so retry
    await expect(async () => {
      await buyNowButton.click({ timeout: 2_000 });
      await expect(
        page.getByText("We couldn't start checkout. Please try again."),
      ).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
  });
});

// GoKwik creates the Shopify order itself, so the shopper's Shopify cart is
// never completed. Its checkout frame posts { type: "orderSuccess" } once the
// order is placed, and the site then empties its own cart.
test.describe("after GoKwik places the order", () => {
  const GOKWIK_ORIGIN = "https://pdp.gokwik.co";
  const ORDER_PLACED = { type: "orderSuccess" };

  /** Adds a product, checks out from the cart page, returns the cart ID. */
  async function checkOutCart(page: Page) {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);
    await page.goto("/cart");
    await checkoutButton(page, "Proceed to Checkout").click();
    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    expect(await cookieValue(page, "checkoutCartId")).toBe(cartId);
    return cartId;
  }

  test("the shopper's cart is emptied", async ({ page }) => {
    await checkOutCart(page);

    await postMessageFrom(page, GOKWIK_ORIGIN, ORDER_PLACED);

    await expect.poll(() => cookieValue(page, "cartId")).toBeUndefined();
    await expect
      .poll(() => cookieValue(page, "checkoutCartId"))
      .toBeUndefined();
    // Still empty after a reload, so the server has forgotten the cart too
    await page.reload();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("the same message from another site is ignored", async ({ page }) => {
    const cartId = await checkOutCart(page);

    await postMessageFrom(page, "https://example.com", ORDER_PLACED);

    expect(await cookieValue(page, "cartId")).toBe(cartId);
    await page.reload();
    await expect(page.getByText("Your cart is empty")).toHaveCount(0);
  });

  test("a Buy Now order leaves the shopper's cart alone", async ({ page }) => {
    await stubGokwik(page);
    await addToCartOrSkip(page);
    const cartId = await cartIdCookie(page);

    await buyNow(page);
    await expect.poll(async () => (await handoffs(page)).length).toBe(1);
    expect(await cookieValue(page, "checkoutCartId")).not.toBe(cartId);

    await postMessageFrom(page, GOKWIK_ORIGIN, ORDER_PLACED);

    await expect
      .poll(() => cookieValue(page, "checkoutCartId"))
      .toBeUndefined();
    expect(await cookieValue(page, "cartId")).toBe(cartId);
  });
});
