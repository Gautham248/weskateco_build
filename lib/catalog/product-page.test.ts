import { productReadState } from "lib/catalog/product-page";
import type { Product } from "lib/shopify/types";
import { describe, expect, it } from "vitest";

const PRODUCT = {
  handle: "sphere-heavy-griptape",
  title: "Sphere Heavy Griptape",
} as unknown as Product;

describe("productReadState", () => {
  describe("a failed read", () => {
    it("a read that could not be performed is 'unavailable'", () => {
      expect(productReadState({ status: "failed" })).toEqual({
        kind: "unavailable",
      });
    });

    // The rule this module exists for. Everything else here is plumbing around it.
    // A fetch failure routed into notFound() would tell customers and crawlers that
    // a real product does not exist.
    it("a failed read is NEVER reported as a missing product", () => {
      expect(productReadState({ status: "failed" }).kind).not.toBe("missing");
    });

    it("a failed read is never reported as a successful one either", () => {
      expect(productReadState({ status: "failed" }).kind).not.toBe("ok");
    });
  });

  describe("a successful read", () => {
    it("a read that found the product is 'ok'", () => {
      expect(productReadState({ status: "ok", product: PRODUCT })).toEqual({
        kind: "ok",
        product: PRODUCT,
      });
    });

    it("the found product is carried through, not rebuilt", () => {
      const state = productReadState({ status: "ok", product: PRODUCT });

      expect(state.kind).toBe("ok");
      expect(state.kind === "ok" && state.product).toBe(PRODUCT);
    });

    it("a read that succeeded with no product is 'missing'", () => {
      expect(productReadState({ status: "ok", product: undefined })).toEqual({
        kind: "missing",
      });
    });
  });

  describe("outcomes", () => {
    it.each([
      ["a failed read", { status: "failed" }],
      ["a read that found the product", { status: "ok", product: PRODUCT }],
      ["a read that found nothing", { status: "ok", product: undefined }],
    ] as const)(
      "only the three known kinds are ever produced (%s)",
      (_label, result) => {
        expect(["ok", "missing", "unavailable"]).toContain(
          productReadState(result).kind,
        );
      },
    );

    // Collapsing these is what turns an outage into a 404.
    it("an unreadable catalogue is distinct from an empty one", () => {
      expect(productReadState({ status: "failed" }).kind).not.toBe(
        productReadState({ status: "ok", product: undefined }).kind,
      );
    });
  });
});
