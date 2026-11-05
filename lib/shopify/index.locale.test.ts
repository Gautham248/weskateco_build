import { afterEach, describe, expect, it, vi } from "vitest";
import type { ShopifyProductOperation } from "./types";
import { createCartMutation } from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";

// "use cache" functions call cacheTag/cacheLife, which only work inside a
// Next.js app with cacheComponents; stub them out
vi.mock("next/cache", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/cache")>()),
  unstable_cacheTag: vi.fn(),
  unstable_cacheLife: vi.fn(),
}));

// The shopper's locale cookie, as the proxy sets it
const cookie = vi.hoisted(() => ({ locale: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "locale" && cookie.locale
        ? { name, value: cookie.locale }
        : undefined,
  }),
}));

// lib/shopify reads its store settings when it loads, so import it fresh
// after setting them
async function loadShopify() {
  vi.resetModules();
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", "https://weskate-test.myshopify.com");
  vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "token");
  return import("lib/shopify");
}

const emptyCart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://weskate-test.myshopify.com/cart/c/1",
  totalQuantity: 0,
  cost: {
    subtotalAmount: { amount: "0.0", currencyCode: "INR" },
    totalAmount: { amount: "0.0", currencyCode: "INR" },
    totalTaxAmount: { amount: "0.0", currencyCode: "INR" },
  },
  lines: { edges: [] },
};

/** Answers every Storefront request with `data` and records the variables sent. */
function fakeShopify(data: unknown) {
  const sent: Record<string, unknown>[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: RequestInit) => {
      sent.push(JSON.parse(String(init.body)).variables ?? {});
      return new Response(JSON.stringify({ data }));
    }),
  );
  return sent;
}

afterEach(() => {
  cookie.locale = undefined;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("shopifyFetch language", () => {
  it("asks for Hindi on Hindi pages", async () => {
    const { shopifyFetch } = await loadShopify();
    const sent = fakeShopify({});
    await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      variables: { handle: "deck" },
      locale: "hi",
    });
    expect(sent).toEqual([{ handle: "deck", language: "HI" }]);
  });

  it("adds the language even when the query has no other variables", async () => {
    const { shopifyFetch } = await loadShopify();
    const sent = fakeShopify({});
    await shopifyFetch({ query: getCollectionsQuery, locale: "hi" });
    expect(sent).toEqual([{ language: "HI" }]);
  });

  it.each([undefined, "en"])(
    "sends English requests unchanged (locale %s)",
    async (locale) => {
      const { shopifyFetch } = await loadShopify();
      const sent = fakeShopify({});
      await shopifyFetch<ShopifyProductOperation>({
        query: getProductQuery,
        variables: { handle: "deck" },
        locale,
      });
      expect(sent).toEqual([{ handle: "deck" }]);
    },
  );

  it("reads a product in the page's language", async () => {
    const { getProduct } = await loadShopify();
    const sent = fakeShopify({ product: null });
    await getProduct("deck", "hi");
    expect(sent).toEqual([{ handle: "deck", language: "HI" }]);
  });
});

describe("cart language", () => {
  it("creates the cart in Hindi for a shopper browsing /hi", async () => {
    cookie.locale = "hi";
    const { createCart } = await loadShopify();
    const sent = fakeShopify({ cartCreate: { cart: emptyCart } });
    await createCart();
    expect(sent).toEqual([{ lineItems: [], language: "HI" }]);
  });

  it("creates an English cart without the cookie", async () => {
    const { createCart } = await loadShopify();
    const sent = fakeShopify({ cartCreate: { cart: emptyCart } });
    await createCart();
    expect(sent).toEqual([{ lineItems: [] }]);
  });

  it("reads the cart in the page's language over the cookie", async () => {
    cookie.locale = "en";
    const { getCart } = await loadShopify();
    const sent = fakeShopify({ cart: emptyCart });
    await getCart("gid://shopify/Cart/1", "hi");
    expect(sent).toEqual([{ cartId: "gid://shopify/Cart/1", language: "HI" }]);
  });
});

// shopifyFetch only adds `language` to the variables; Shopify ignores it
// unless the query declares it and applies it with @inContext
describe.each([
  ["getProductQuery", getProductQuery],
  ["getProductsQuery", getProductsQuery],
  ["getProductRecommendationsQuery", getProductRecommendationsQuery],
  ["getCollectionQuery", getCollectionQuery],
  ["getCollectionsQuery", getCollectionsQuery],
  ["getCollectionProductsQuery", getCollectionProductsQuery],
  ["getCartQuery", getCartQuery],
  ["createCartMutation", createCartMutation],
])("%s", (_name, query) => {
  it("declares the language and applies it", () => {
    expect(query).toContain("$language: LanguageCode = EN");
    expect(query).toContain("@inContext(language: $language)");
  });
});
