import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import { describe, expect, it } from "vitest";

const SHOPIFY =
  "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475";
const SHOPIFY_HASHED =
  "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegumfullsetup2_8f920556-4507-4689-b2f6-03d35ec49970.png?v=1777627714";
const IMAGEKIT = "https://ik.imagekit.io/kyfkw6hca/covers/deck.webp";

describe("shopifyImageUrl", () => {
  it("a shopify url gains a width without losing its version parameter", () => {
    expect(shopifyImageUrl(SHOPIFY, 800)).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475&width=800",
    );
  });

  // The whole point of the module: the optimizer downloads the source, and a
  // 16 MB original is what makes it time out at 500.
  it("the original is never requested without a width", () => {
    expect(shopifyImageUrl(SHOPIFY, SHOPIFY_IMAGE_WIDTH.card)).toContain(
      "width=1024",
    );
  });

  it("a hashed filename is resized too", () => {
    expect(shopifyImageUrl(SHOPIFY_HASHED, 800)).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegumfullsetup2_8f920556-4507-4689-b2f6-03d35ec49970.png?v=1777627714&width=800",
    );
  });

  it("a url with no query string gains one", () => {
    expect(
      shopifyImageUrl(
        "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png",
        800,
      ),
    ).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?width=800",
    );
  });

  it("an existing width is replaced, not duplicated", () => {
    expect(
      shopifyImageUrl(
        "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?v=1&width=1200",
        800,
      ),
    ).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?v=1&width=800",
    );
  });

  it("a caller may ask for a smaller size than a hardcoded one", () => {
    expect(
      shopifyImageUrl(
        "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/griptape.png?width=1200",
        256,
      ),
    ).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/griptape.png?width=256",
    );
  });

  // Admin overrides can swap a product image for an uploaded one, so the helper is
  // deliberately wrapped around URLs whose host is not known at the call site.
  it("an imagekit url is left alone", () => {
    expect(shopifyImageUrl(IMAGEKIT, 800)).toBe(IMAGEKIT);
  });

  it("a local asset is left alone", () => {
    expect(shopifyImageUrl("/icons/logo.svg", 800)).toBe("/icons/logo.svg");
  });

  it("a shopify-looking host that is not the cdn is left alone", () => {
    expect(shopifyImageUrl("https://shopify.com/s/files/1/deck.png", 800)).toBe(
      "https://shopify.com/s/files/1/deck.png",
    );
  });

  it("an empty url is left alone", () => {
    expect(shopifyImageUrl("", 800)).toBe("");
  });

  it("a non-numeric width is ignored rather than producing a broken url", () => {
    expect(shopifyImageUrl(SHOPIFY, Number.NaN)).toBe(SHOPIFY);
  });

  it("a zero width is ignored", () => {
    expect(shopifyImageUrl(SHOPIFY, 0)).toBe(SHOPIFY);
  });

  it("a negative width is ignored", () => {
    expect(shopifyImageUrl(SHOPIFY, -800)).toBe(SHOPIFY);
  });

  it("a fractional width is rounded to a whole pixel", () => {
    expect(shopifyImageUrl(SHOPIFY, 799.6)).toBe(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475&width=800",
    );
  });
});

describe("SHOPIFY_IMAGE_WIDTH", () => {
  // A thumb being larger than a hero would mean the buckets were mis-ordered.
  it("the three buckets increase in size", () => {
    expect(SHOPIFY_IMAGE_WIDTH.thumb).toBeLessThan(SHOPIFY_IMAGE_WIDTH.card);
    expect(SHOPIFY_IMAGE_WIDTH.card).toBeLessThan(SHOPIFY_IMAGE_WIDTH.hero);
  });
});
