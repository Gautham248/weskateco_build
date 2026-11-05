import type { ProductOverrideWithImages } from "lib/admin/queries";
import type { Product } from "lib/shopify/types";
import { describe, expect, it, vi } from "vitest";
import { withOverrides } from "./overrides";

// One admin override for "test-deck", read without a database
vi.mock("lib/admin/queries", () => ({
  listOverridesForHandles: vi.fn(
    async (): Promise<ProductOverrideWithImages[]> => [
      {
        id: "override-1",
        productHandle: "test-deck",
        shopifyProductId: null,
        title: "Edited English Title",
        descriptionHtml: "<p>Edited English copy</p>",
        galleryMode: "append",
        coverImageUrl: null,
        removedImageUrls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
        images: [
          {
            id: "image-1",
            overrideId: "override-1",
            url: "https://ik.imagekit.io/weskate/extra.jpg",
            altText: null,
            imagekitFileId: null,
            width: 1000,
            height: 1000,
            position: 0,
            createdAt: new Date(),
          },
        ],
      },
    ],
  ),
}));

const deck = (title: string) =>
  ({
    handle: "test-deck",
    title,
    description: title,
    descriptionHtml: `<p>${title}</p>`,
    seo: { title, description: "" },
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1.jpg",
      altText: "",
      width: 1000,
      height: 1000,
    },
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1.jpg",
        altText: "",
        width: 1000,
        height: 1000,
      },
    ],
  }) as Product;

describe("withOverrides by locale", () => {
  it("applies the English text overrides on English pages", async () => {
    const [product] = await withOverrides([deck("Test Deck")]);
    expect(product!.title).toBe("Edited English Title");
    expect(product!.images).toHaveLength(2);
  });

  it("keeps the Hindi text from Shopify on Hindi pages, with the photos", async () => {
    const [product] = await withOverrides([deck("टेस्ट डेक")], "hi");
    expect(product!.title).toBe("टेस्ट डेक");
    expect(product!.descriptionHtml).toBe("<p>टेस्ट डेक</p>");
    expect(product!.images.map((each) => each.url)).toEqual([
      "https://cdn.shopify.com/s/files/1.jpg",
      "https://ik.imagekit.io/weskate/extra.jpg",
    ]);
  });
});
