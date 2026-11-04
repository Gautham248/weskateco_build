import { TAGS } from "lib/constants";
import type { Cart, CartItem } from "lib/shopify/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addConfiguratorBundle,
  addItem,
  buyNowAction,
  createCartAndSetCookie,
  createSingleItemCartAction,
  editCartItemVariantAction,
  redirectToCheckout,
  removeItem,
  updateItemQuantity,
} from "./actions";

// vi.mock calls are hoisted above the imports.
// Server actions run inside a Next.js request with Shopify behind them. Swap
// in an in-memory cookie jar and a fake Shopify layer so each action's
// orchestration can be tested on its own.
const cookieJar = vi.hoisted(() => new Map<string, string>());
const cookieOptions = vi.hoisted(() => new Map<string, unknown>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined,
    set: (name: string, value: string, options?: unknown) => {
      cookieJar.set(name, value);
      cookieOptions.set(name, options);
    },
  }),
}));

const updateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ updateTag }));

// next/navigation's redirect() throws to stop rendering; mirror that
const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
);
vi.mock("next/navigation", () => ({ redirect }));

const shopify = vi.hoisted(() => ({
  getCart: vi.fn(),
  createCart: vi.fn(),
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCart: vi.fn(),
}));
vi.mock("lib/shopify", () => shopify);

const CHECKOUT_URL = "https://weskate-test.myshopify.com/checkouts/abc";

function line(id: string, merchandiseId: string, quantity = 1): CartItem {
  return { id, quantity, merchandise: { id: merchandiseId } } as CartItem;
}

function cart(id: string, lines: CartItem[] = []): Cart {
  return {
    id,
    checkoutUrl: CHECKOUT_URL,
    lines,
    totalQuantity: lines.length,
  } as Cart;
}

beforeEach(() => {
  cookieJar.clear();
  cookieOptions.clear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const fn of [updateTag, redirect, ...Object.values(shopify)]) {
    fn.mockReset();
  }
  redirect.mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  });
});

describe("addItem", () => {
  it("rejects a missing variant without calling Shopify", async () => {
    expect(await addItem(null, undefined)).toBe("Error adding item to cart");
    expect(shopify.createCart).not.toHaveBeenCalled();
    expect(shopify.addToCart).not.toHaveBeenCalled();
  });

  it("creates a cart, sets the cookie, then adds the line for a first-time visitor", async () => {
    shopify.createCart.mockResolvedValue(cart("cart-new"));

    expect(await addItem(null, "variant-1")).toBeUndefined();

    expect(cookieJar.get("cartId")).toBe("cart-new");
    // Kept for 30 days so the cart survives browser restarts
    expect(cookieOptions.get("cartId")).toEqual({
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    expect(shopify.addToCart).toHaveBeenCalledWith([
      { merchandiseId: "variant-1", quantity: 1 },
    ]);
    // The cookie must exist before the line is added: addToCart reads it
    expect(shopify.createCart.mock.invocationCallOrder[0]).toBeLessThan(
      shopify.addToCart.mock.invocationCallOrder[0]!,
    );
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart);
  });

  it("reuses the existing cart", async () => {
    cookieJar.set("cartId", "cart-existing");
    shopify.getCart.mockResolvedValue(cart("cart-existing"));

    expect(await addItem(null, "variant-1")).toBeUndefined();

    expect(shopify.createCart).not.toHaveBeenCalled();
    expect(cookieJar.get("cartId")).toBe("cart-existing");
    expect(shopify.addToCart).toHaveBeenCalledOnce();
  });

  it("replaces a cookie that points to a cart Shopify no longer has", async () => {
    cookieJar.set("cartId", "cart-expired");
    shopify.getCart.mockResolvedValue(undefined);
    shopify.createCart.mockResolvedValue(cart("cart-new"));

    expect(await addItem(null, "variant-1")).toBeUndefined();

    expect(cookieJar.get("cartId")).toBe("cart-new");
    expect(shopify.addToCart).toHaveBeenCalledOnce();
  });

  it("reports a failure to create the cart", async () => {
    shopify.createCart.mockRejectedValue(new Error("Shopify down"));

    expect(await addItem(null, "variant-1")).toBe("Error creating cart");
    expect(cookieJar.has("cartId")).toBe(false);
    expect(shopify.addToCart).not.toHaveBeenCalled();
  });

  it("reports a failure to add the line without refreshing the cart", async () => {
    shopify.createCart.mockResolvedValue(cart("cart-new"));
    shopify.addToCart.mockRejectedValue(new Error("Variant sold out"));

    expect(await addItem(null, "variant-1")).toBe("Error adding item to cart");
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe("removeItem", () => {
  it("removes the line for the given variant", async () => {
    shopify.getCart.mockResolvedValue(
      cart("cart-1", [
        line("line-1", "variant-1"),
        line("line-2", "variant-2"),
      ]),
    );

    expect(await removeItem(null, "variant-2")).toBeUndefined();

    expect(shopify.removeFromCart).toHaveBeenCalledWith(["line-2"]);
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart);
  });

  it("reports when there is no cart", async () => {
    shopify.getCart.mockResolvedValue(undefined);
    expect(await removeItem(null, "variant-1")).toBe("Error fetching cart");
  });

  it("reports a variant that isn't in the cart", async () => {
    shopify.getCart.mockResolvedValue(
      cart("cart-1", [line("line-1", "variant-1")]),
    );
    expect(await removeItem(null, "variant-9")).toBe("Item not found in cart");
    expect(shopify.removeFromCart).not.toHaveBeenCalled();
  });

  it("reports a Shopify failure", async () => {
    shopify.getCart.mockResolvedValue(
      cart("cart-1", [line("line-1", "variant-1")]),
    );
    shopify.removeFromCart.mockRejectedValue(new Error("Shopify down"));
    expect(await removeItem(null, "variant-1")).toBe(
      "Error removing item from cart",
    );
  });
});

describe("updateItemQuantity", () => {
  beforeEach(() => {
    shopify.getCart.mockResolvedValue(
      cart("cart-1", [line("line-1", "variant-1", 2)]),
    );
  });

  it("updates the quantity of an existing line", async () => {
    expect(
      await updateItemQuantity(null, {
        merchandiseId: "variant-1",
        quantity: 3,
      }),
    ).toBeUndefined();
    expect(shopify.updateCart).toHaveBeenCalledWith([
      { id: "line-1", merchandiseId: "variant-1", quantity: 3 },
    ]);
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart);
  });

  it("removes the line when the quantity drops to 0", async () => {
    await updateItemQuantity(null, { merchandiseId: "variant-1", quantity: 0 });
    expect(shopify.removeFromCart).toHaveBeenCalledWith(["line-1"]);
    expect(shopify.updateCart).not.toHaveBeenCalled();
  });

  it("adds a variant that isn't in the cart yet", async () => {
    await updateItemQuantity(null, { merchandiseId: "variant-2", quantity: 1 });
    expect(shopify.addToCart).toHaveBeenCalledWith([
      { merchandiseId: "variant-2", quantity: 1 },
    ]);
  });

  it("does nothing to Shopify when removing a variant that isn't in the cart", async () => {
    await updateItemQuantity(null, { merchandiseId: "variant-2", quantity: 0 });
    expect(shopify.addToCart).not.toHaveBeenCalled();
    expect(shopify.removeFromCart).not.toHaveBeenCalled();
    expect(shopify.updateCart).not.toHaveBeenCalled();
  });

  it("reports when there is no cart", async () => {
    shopify.getCart.mockResolvedValue(undefined);
    expect(
      await updateItemQuantity(null, {
        merchandiseId: "variant-1",
        quantity: 3,
      }),
    ).toBe("Error fetching cart");
  });

  it("reports a Shopify failure", async () => {
    shopify.updateCart.mockRejectedValue(new Error("Shopify down"));
    expect(
      await updateItemQuantity(null, {
        merchandiseId: "variant-1",
        quantity: 3,
      }),
    ).toBe("Error updating item quantity");
    expect(updateTag).not.toHaveBeenCalled();
  });
});

describe("editCartItemVariantAction", () => {
  it("swaps the line to the new variant", async () => {
    shopify.getCart.mockResolvedValue(
      cart("cart-1", [line("line-1", "variant-1")]),
    );

    expect(
      await editCartItemVariantAction({
        lineId: "line-1",
        newMerchandiseId: "variant-2",
        quantity: 2,
      }),
    ).toBeUndefined();

    expect(shopify.updateCart).toHaveBeenCalledWith([
      { id: "line-1", merchandiseId: "variant-2", quantity: 2 },
    ]);
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart);
  });

  it("reports when there is no cart or Shopify fails", async () => {
    const payload = {
      lineId: "line-1",
      newMerchandiseId: "variant-2",
      quantity: 1,
    };
    shopify.getCart.mockResolvedValue(undefined);
    expect(await editCartItemVariantAction(payload)).toBe(
      "Error fetching cart",
    );

    shopify.getCart.mockResolvedValue(cart("cart-1"));
    shopify.updateCart.mockRejectedValue(new Error("Shopify down"));
    expect(await editCartItemVariantAction(payload)).toBe(
      "Error updating item variant",
    );
  });
});

describe("addConfiguratorBundle", () => {
  beforeEach(() => {
    cookieJar.set("cartId", "cart-existing");
  });

  it("creates a cart first for a visitor without one", async () => {
    cookieJar.clear();
    shopify.createCart.mockResolvedValue(cart("cart-new"));

    await addConfiguratorBundle(null, [{ merchandiseId: "deck", quantity: 1 }]);

    expect(cookieJar.get("cartId")).toBe("cart-new");
    expect(shopify.createCart.mock.invocationCallOrder[0]).toBeLessThan(
      shopify.addToCart.mock.invocationCallOrder[0]!,
    );
  });

  it("keeps an existing cart rather than orphaning its items", async () => {
    await addConfiguratorBundle(null, [{ merchandiseId: "deck", quantity: 1 }]);
    expect(shopify.createCart).not.toHaveBeenCalled();
    expect(cookieJar.get("cartId")).toBe("cart-existing");
  });

  it("tags every line with the same bundle id", async () => {
    expect(
      await addConfiguratorBundle(null, [
        { merchandiseId: "deck", quantity: 1 },
        {
          merchandiseId: "trucks",
          quantity: 1,
          attributes: [{ key: "note", value: "pair" }],
        },
      ]),
    ).toBeUndefined();

    const lines = shopify.addToCart.mock.calls[0]![0] as {
      merchandiseId: string;
      attributes: { key: string; value: string }[];
    }[];
    const bundleIds = lines.map(
      (l) => l.attributes.find((a) => a.key === "_bundle_id")?.value,
    );
    expect(bundleIds[0]).toMatch(/^bundle_/);
    expect(bundleIds[1]).toBe(bundleIds[0]);
    expect(lines[1]!.attributes).toEqual(
      expect.arrayContaining([
        { key: "note", value: "pair" },
        { key: "_configurator_bundle", value: "true" },
      ]),
    );
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart);
  });

  it("rejects an empty bundle without calling Shopify", async () => {
    expect(await addConfiguratorBundle(null, [])).toBe("No items to add");
    expect(shopify.addToCart).not.toHaveBeenCalled();
  });

  it("reports a Shopify failure", async () => {
    shopify.addToCart.mockRejectedValue(new Error("Shopify down"));
    expect(
      await addConfiguratorBundle(null, [
        { merchandiseId: "deck", quantity: 1 },
      ]),
    ).toBe("Error adding configurator bundle to cart");
  });
});

describe("checkout", () => {
  it("buyNowAction adds the variant and redirects to checkout", async () => {
    cookieJar.set("cartId", "cart-1");
    shopify.getCart.mockResolvedValue(cart("cart-1"));

    await expect(buyNowAction("variant-1")).rejects.toThrow(
      `NEXT_REDIRECT:${CHECKOUT_URL}`,
    );
    expect(shopify.addToCart).toHaveBeenCalledWith([
      { merchandiseId: "variant-1", quantity: 1 },
    ]);
  });

  it("buyNowAction reports a failure instead of redirecting", async () => {
    // Buy Now doesn't create a cart: it relies on the cart button having
    // created one on page load. Without a cart, Shopify rejects the add.
    shopify.addToCart.mockRejectedValue(new Error("Cart not found"));

    expect(await buyNowAction("variant-1")).toBe("Error adding item to cart");
    expect(redirect).not.toHaveBeenCalled();
    expect(await buyNowAction(undefined)).toBe("Error adding item to cart");
  });

  it("redirectToCheckout does nothing when there's no cart", async () => {
    shopify.getCart.mockResolvedValue(undefined);
    await expect(redirectToCheckout()).resolves.toBeUndefined();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirectToCheckout sends the shopper to the cart's checkout", async () => {
    shopify.getCart.mockResolvedValue(cart("cart-1"));
    await expect(redirectToCheckout()).rejects.toThrow(
      `NEXT_REDIRECT:${CHECKOUT_URL}`,
    );
  });

  it("createCartAndSetCookie stores the new cart id for 30 days", async () => {
    shopify.createCart.mockResolvedValue(cart("cart-new"));
    await createCartAndSetCookie();
    expect(cookieJar.get("cartId")).toBe("cart-new");
    expect(cookieOptions.get("cartId")).toMatchObject({ maxAge: 2592000 });
  });

  it("createSingleItemCartAction creates a separate one-item cart", async () => {
    shopify.createCart.mockResolvedValue(cart("cart-single"));

    expect(await createSingleItemCartAction("variant-1")).toEqual({
      id: "cart-single",
      checkoutUrl: CHECKOUT_URL,
    });
    expect(shopify.createCart).toHaveBeenCalledWith([
      { merchandiseId: "variant-1", quantity: 1 },
    ]);
    // It doesn't replace the shopper's main cart
    expect(cookieJar.has("cartId")).toBe(false);
  });

  it("createSingleItemCartAction returns null on a missing variant or failure", async () => {
    expect(await createSingleItemCartAction("")).toBeNull();
    shopify.createCart.mockRejectedValue(new Error("Shopify down"));
    expect(await createSingleItemCartAction("variant-1")).toBeNull();
  });
});
