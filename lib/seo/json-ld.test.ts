import type { Product, ProductVariant } from "lib/shopify/types";
import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  productJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "./json-ld";

const URL = "https://weskate.co/product/popsicle-deck";

function variant(id: string, sku: string | null = null): ProductVariant {
  return {
    id,
    title: id,
    sku,
    availableForSale: true,
    selectedOptions: [],
    price: { amount: "1800", currencyCode: "INR" },
    compareAtPrice: null,
  };
}

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: "gid://shopify/Product/1",
    handle: "popsicle-deck",
    title: "Popsicle Deck",
    description: "7-ply maple deck",
    descriptionHtml: "",
    vendor: "Sphere",
    availableForSale: true,
    options: [],
    priceRange: {
      minVariantPrice: { amount: "1800", currencyCode: "INR" },
      maxVariantPrice: { amount: "2200", currencyCode: "INR" },
    },
    variants: [variant("v1", "DECK-80"), variant("v2", "DECK-825")],
    featuredImage: {
      url: "https://cdn/a.png",
      altText: "",
      width: 1,
      height: 1,
    },
    images: [
      { url: "https://cdn/a.png", altText: "", width: 1, height: 1 },
      { url: "https://cdn/b.png", altText: "", width: 1, height: 1 },
    ],
    seo: { title: "", description: "" },
    metafields: [],
    tags: [],
    updatedAt: "2026-07-19T00:00:00Z",
    ...overrides,
  };
}

describe("serializeJsonLd", () => {
  it("escapes < so text can't close the script tag", () => {
    const json = serializeJsonLd({
      description: "Great deck</script><script>alert(1)</script>",
    });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json).description).toBe(
      "Great deck</script><script>alert(1)</script>",
    );
  });

  it("serializes a list of items as an array", () => {
    expect(JSON.parse(serializeJsonLd([{ a: 1 }, { b: 2 }]))).toEqual([
      { a: 1 },
      { b: 2 },
    ]);
  });
});

describe("productJsonLd", () => {
  it("describes the product with brand, images, URL and price range", () => {
    expect(productJsonLd(product(), URL)).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Popsicle Deck",
      description: "7-ply maple deck",
      url: URL,
      image: ["https://cdn/a.png", "https://cdn/b.png"],
      brand: { "@type": "Brand", name: "Sphere" },
      offers: {
        "@type": "AggregateOffer",
        url: URL,
        priceCurrency: "INR",
        lowPrice: "1800",
        highPrice: "2200",
        offerCount: 2,
        availability: "https://schema.org/InStock",
      },
    });
  });

  it("includes the SKU only when there's a single variant", () => {
    expect(productJsonLd(product(), URL).sku).toBeUndefined();
    expect(
      productJsonLd(product({ variants: [variant("v1", "DECK-80")] }), URL).sku,
    ).toBe("DECK-80");
  });

  it("marks sold-out products out of stock", () => {
    const offers = productJsonLd(product({ availableForSale: false }), URL)
      .offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/OutOfStock");
  });

  it("falls back to the featured image, and omits empty fields", () => {
    const data = productJsonLd(product({ images: [], vendor: "" }), URL);
    expect(data.image).toEqual(["https://cdn/a.png"]);
    expect(data.brand).toBeUndefined();
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers the trail from 1", () => {
    expect(
      breadcrumbJsonLd([
        { name: "Home", url: "https://weskate.co/" },
        { name: "Decks", url: "https://weskate.co/store/decks" },
      ]),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://weskate.co/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Decks",
          item: "https://weskate.co/store/decks",
        },
      ],
    });
  });
});

describe("site-wide data", () => {
  it("describes the organisation and website", () => {
    expect(
      organizationJsonLd("WeSkate Co", "https://weskate.co"),
    ).toMatchObject({
      "@type": "Organization",
      name: "WeSkate Co",
      url: "https://weskate.co",
    });
    expect(
      organizationJsonLd("WeSkate Co", "https://weskate.co"),
    ).not.toHaveProperty("logo");
    expect(
      organizationJsonLd(
        "WeSkate Co",
        "https://weskate.co",
        "https://weskate.co/icons/weskate-logo.png",
      ),
    ).toMatchObject({ logo: "https://weskate.co/icons/weskate-logo.png" });
    expect(websiteJsonLd("WeSkate Co", "https://weskate.co")).toMatchObject({
      "@type": "WebSite",
      name: "WeSkate Co",
      url: "https://weskate.co",
    });
  });
});
