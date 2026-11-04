// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The one-item cart Buy Now makes, and the toast shown when it can't
const createSingleItemCartAction = vi.hoisted(() => vi.fn());
vi.mock("components/cart/actions", () => ({ createSingleItemCartAction }));
const toast = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

import { CHECKOUT_START_ERROR } from "./checkout-cart";
import { checkoutCart, checkoutOneItem } from "./checkout";

const CART = { id: "gid://shopify/Cart/1", checkoutUrl: "https://shop/c/1" };

const assign = vi.fn();

beforeEach(() => {
  window.merchantInfo = { mid: "m1" };
  // jsdom can't navigate; record where checkout would have gone
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, assign },
  });
});

afterEach(() => {
  assign.mockReset();
  createSingleItemCartAction.mockReset();
  toast.error.mockReset();
  delete window.triggerGokwikCustomCheckout;
  document.cookie = "checkoutCartId=; path=/; max-age=0";
  vi.restoreAllMocks();
});

describe("checkoutCart", () => {
  it("hands the cart to GoKwik when its SDK is on the page", () => {
    const trigger = vi.fn();
    window.triggerGokwikCustomCheckout = trigger;

    checkoutCart(CART);

    expect(window.merchantInfo?.cart).toEqual({ id: CART.id });
    expect(trigger).toHaveBeenCalledOnce();
    expect(assign).not.toHaveBeenCalled();
  });

  it("remembers the cart it hands to GoKwik, for GoKwik's /cart/checkout fallback", () => {
    window.triggerGokwikCustomCheckout = vi.fn();
    checkoutCart(CART);
    expect(document.cookie).toContain(
      `checkoutCartId=${encodeURIComponent(CART.id)}`,
    );
  });

  it("sends the shopper to Shopify's checkout when GoKwik isn't loaded", () => {
    checkoutCart(CART);
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
    expect(window.merchantInfo?.cart).toBeUndefined();
  });

  it("falls back to Shopify's checkout when GoKwik's checkout throws", () => {
    window.triggerGokwikCustomCheckout = vi.fn(() => {
      throw new Error("GoKwik broke");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    checkoutCart(CART);
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
  });

  it("falls back to Shopify's checkout when GoKwik's config is missing", () => {
    const trigger = vi.fn();
    window.triggerGokwikCustomCheckout = trigger;
    window.merchantInfo = undefined;
    checkoutCart(CART);
    expect(trigger).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
  });
});

describe("checkoutOneItem (Buy Now, Buy on EMI)", () => {
  it("makes a one-item cart and opens checkout for it", async () => {
    createSingleItemCartAction.mockResolvedValue(CART);
    const onCartCreated = vi.fn();

    await checkoutOneItem("variant-1", onCartCreated);

    expect(createSingleItemCartAction).toHaveBeenCalledWith("variant-1");
    expect(onCartCreated).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it.each([
    ["Shopify can't make the cart", () => Promise.resolve(null)],
    ["the request fails", () => Promise.reject(new Error("fetch failed"))],
  ])("tells the shopper when %s", async (_, makeCart) => {
    createSingleItemCartAction.mockImplementation(makeCart);
    const onCartCreated = vi.fn();

    await checkoutOneItem("variant-1", onCartCreated);

    expect(toast.error).toHaveBeenCalledWith(CHECKOUT_START_ERROR);
    expect(onCartCreated).not.toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });
});
