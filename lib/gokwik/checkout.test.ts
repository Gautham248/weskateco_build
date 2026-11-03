// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkoutCart, GOKWIK_WAIT_MS, waitForGoKwik } from "./checkout";
import { GOKWIK_LOADED_EVENT } from "./use-gokwik-checkout";

const CART = { id: "gid://shopify/Cart/1", checkoutUrl: "https://shop/c/1" };

function setCountry(country: string) {
  document.cookie = `country=${country}; path=/`;
}

/** Simulates GoKwik's SDK arriving on the page */
function loadGoKwik() {
  const trigger = vi.fn();
  window.triggerGokwikCustomCheckout = trigger;
  window.dispatchEvent(new Event(GOKWIK_LOADED_EVENT));
  return trigger;
}

const assign = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  window.merchantInfo = { mid: "m1" };
  // jsdom can't navigate; record where checkout would have gone
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, assign },
  });
});

afterEach(() => {
  vi.useRealTimers();
  assign.mockReset();
  delete window.triggerGokwikCustomCheckout;
  document.cookie = "country=; path=/; max-age=0";
  document.cookie = "checkoutCartId=; path=/; max-age=0";
  vi.restoreAllMocks();
});

describe("waitForGoKwik", () => {
  it("is false at once outside India, even with the SDK on the page", async () => {
    setCountry("US");
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(false);
  });

  it("is true at once in India when the SDK has loaded", async () => {
    setCountry("IN");
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(true);
  });

  it("waits for an SDK that is still loading", async () => {
    setCountry("IN");
    const ready = waitForGoKwik();
    await vi.advanceTimersByTimeAsync(GOKWIK_WAIT_MS - 1000);
    loadGoKwik();
    expect(await ready).toBe(true);
  });

  it("gives up when the SDK doesn't arrive in time", async () => {
    setCountry("IN");
    const ready = waitForGoKwik();
    await vi.advanceTimersByTimeAsync(GOKWIK_WAIT_MS);
    expect(await ready).toBe(false);
  });

  it("treats an unknown country as India (local development)", async () => {
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(true);
  });
});

describe("checkoutCart", () => {
  it("hands the cart to GoKwik in India", async () => {
    setCountry("IN");
    const trigger = vi.fn();
    window.triggerGokwikCustomCheckout = trigger;

    await checkoutCart(CART);

    expect(window.merchantInfo?.cart).toEqual({ id: CART.id });
    expect(trigger).toHaveBeenCalledOnce();
    expect(assign).not.toHaveBeenCalled();
  });

  it("sends shoppers outside India to Shopify's checkout", async () => {
    setCountry("US");
    await checkoutCart(CART);
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
    expect(window.merchantInfo?.cart).toBeUndefined();
  });

  it("remembers the cart it hands to GoKwik, for GoKwik's /cart/checkout fallback", async () => {
    setCountry("IN");
    window.triggerGokwikCustomCheckout = vi.fn();
    await checkoutCart(CART);
    expect(document.cookie).toContain(
      `checkoutCartId=${encodeURIComponent(CART.id)}`,
    );
  });

  it("falls back to Shopify's checkout when GoKwik's checkout throws", async () => {
    setCountry("IN");
    window.triggerGokwikCustomCheckout = vi.fn(() => {
      throw new Error("GoKwik broke");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    await checkoutCart(CART);
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
  });

  it("falls back to Shopify's checkout when GoKwik's config is missing", async () => {
    setCountry("IN");
    const trigger = vi.fn();
    window.triggerGokwikCustomCheckout = trigger;
    window.merchantInfo = undefined;
    await checkoutCart(CART);
    expect(trigger).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
  });

  it("falls back to Shopify's checkout when GoKwik never loads", async () => {
    setCountry("IN");
    const done = checkoutCart(CART);
    await vi.advanceTimersByTimeAsync(GOKWIK_WAIT_MS);
    await done;
    expect(assign).toHaveBeenCalledWith(CART.checkoutUrl);
  });
});
