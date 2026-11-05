import { describe, expect, it } from "vitest";
import {
  isGoKwikOrderSuccess,
  isGoKwikOrigin,
  orderedShoppersCart,
} from "./order-success";

describe("isGoKwikOrigin", () => {
  it.each([
    "https://pdp.gokwik.co",
    "https://sandbox.pdp.gokwik.co",
    "https://gokwik.co",
  ])("accepts GoKwik's checkout at %s", (origin) => {
    expect(isGoKwikOrigin(origin)).toBe(true);
  });

  it.each([
    ["plain http", "http://pdp.gokwik.co"],
    ["a look-alike domain", "https://pdp.gokwik.co.evil.example"],
    ["a domain ending in gokwik.co", "https://notgokwik.co"],
    ["this site", "https://weskateco.com"],
    ["an opaque origin", "null"],
    ["an empty origin", ""],
  ])("rejects %s", (_, origin) => {
    expect(isGoKwikOrigin(origin)).toBe(false);
  });
});

describe("isGoKwikOrderSuccess", () => {
  const origin = "https://pdp.gokwik.co";

  it("recognises GoKwik's order-placed message", () => {
    expect(
      isGoKwikOrderSuccess({ origin, data: { type: "orderSuccess" } }),
    ).toBe(true);
  });

  it("ignores the same message from anywhere else", () => {
    expect(
      isGoKwikOrderSuccess({
        origin: "https://weskateco.com",
        data: { type: "orderSuccess" },
      }),
    ).toBe(false);
  });

  it.each([
    ["another message type", { type: "modal_closed" }],
    ["a string", "orderSuccess"],
    ["null", null],
    ["nothing", undefined],
  ])("ignores %s from GoKwik", (_, data) => {
    expect(isGoKwikOrderSuccess({ origin, data })).toBe(false);
  });
});

describe("orderedShoppersCart", () => {
  it("is true when GoKwik took the shopper's own cart", () => {
    expect(
      orderedShoppersCart(
        "cartId=gid%3A%2F%2Fshopify%2FCart%2F1; checkoutCartId=gid%3A%2F%2Fshopify%2FCart%2F1",
      ),
    ).toBe(true);
  });

  it("is false for a one-item Buy Now cart, which leaves the shopper's cart alone", () => {
    expect(orderedShoppersCart("cartId=main; checkoutCartId=buy-now")).toBe(
      false,
    );
  });

  it.each([
    ["no cart was handed to GoKwik", "cartId=main"],
    ["the shopper has no cart", "checkoutCartId=main"],
    ["there are no cookies", ""],
  ])("is false when %s", (_, cookies) => {
    expect(orderedShoppersCart(cookies)).toBe(false);
  });

  it("matches the exact cookie, not one whose name ends the same", () => {
    expect(orderedShoppersCart("xcartId=main; checkoutCartId=main")).toBe(
      false,
    );
  });

  it("copes with a cookie value that isn't valid URL encoding", () => {
    expect(orderedShoppersCart("cartId=%E0%A4; checkoutCartId=%E0%A4")).toBe(
      true,
    );
  });
});
