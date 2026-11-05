import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Cookies and the Shopify cart lookup, swapped for fakes per test
const jar = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      jar.has(name) ? { name, value: jar.get(name)! } : undefined,
  }),
}));
const getCart = vi.hoisted(() => vi.fn());
vi.mock("lib/shopify", () => ({ getCart }));

import { GET } from "./route";

const cart = (id: string, totalQuantity = 1) => ({
  id,
  checkoutUrl: `https://shop.example/cart/c/${id}`,
  totalQuantity,
});

async function visit(locale = "en") {
  const res = await GET(
    new NextRequest(`https://weskate.co/${locale}/cart/checkout`),
    { params: Promise.resolve({ locale }) },
  );
  return { status: res.status, location: res.headers.get("location") };
}

beforeEach(() => {
  jar.clear();
  getCart.mockReset();
  getCart.mockImplementation(async (id: string) => cart(id));
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("/cart/checkout (GoKwik's fallback URL)", () => {
  it("sends the shopper to the Shopify checkout of the cart they handed to GoKwik", async () => {
    jar.set("checkoutCartId", "buy-now-cart");
    jar.set("cartId", "main-cart");
    expect(await visit()).toEqual({
      status: 303,
      location: "https://shop.example/cart/c/buy-now-cart",
    });
    expect(getCart).toHaveBeenCalledWith("buy-now-cart");
  });

  it("uses the shopper's own cart when nothing was handed to GoKwik", async () => {
    jar.set("cartId", "main-cart");
    expect((await visit()).location).toBe(
      "https://shop.example/cart/c/main-cart",
    );
  });

  it("goes back to the cart page without a cart", async () => {
    expect(await visit()).toEqual({
      status: 303,
      location: "https://weskate.co/cart",
    });
    expect(getCart).not.toHaveBeenCalled();
  });

  it("uses the Hindi cart page for Hindi shoppers", async () => {
    expect((await visit("hi")).location).toBe("https://weskate.co/hi/cart");
  });

  it.each([
    ["the cart is empty", async () => cart("main-cart", 0)],
    ["Shopify no longer has the cart (already ordered)", async () => undefined],
    [
      "Shopify can't be reached",
      async () => {
        throw new Error("fetch failed");
      },
    ],
  ])("goes back to the cart page when %s", async (_, lookup) => {
    jar.set("cartId", "main-cart");
    getCart.mockImplementation(lookup);
    expect((await visit()).location).toBe("https://weskate.co/cart");
  });
});
