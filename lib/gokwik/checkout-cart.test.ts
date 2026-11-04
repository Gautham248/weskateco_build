import { afterEach, describe, expect, it, vi } from "vitest";
import { CHECKOUT_CART_COOKIE, rememberCheckoutCart } from "./checkout-cart";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("rememberCheckoutCart", () => {
  it("stores the cart for an hour, site-wide, for /cart/checkout to read", () => {
    let written = "";
    vi.stubGlobal("document", {
      set cookie(value: string) {
        written = value;
      },
    });

    rememberCheckoutCart("gid://shopify/Cart/1");

    expect(written).toBe(
      `${CHECKOUT_CART_COOKIE}=gid%3A%2F%2Fshopify%2FCart%2F1; path=/; max-age=3600; samesite=lax`,
    );
  });
});
