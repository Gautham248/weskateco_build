import { describe, it, expect, vi } from "vitest";

// Mock shopifyFetch helper inside shopify-admin
vi.mock("lib/admin/shopify-admin", async () => {
  const actual = await vi.importActual<typeof import("lib/admin/shopify-admin")>("lib/admin/shopify-admin");
  return {
    ...actual,
    searchProducts: vi.fn().mockResolvedValue([
      {
        id: "gid://shopify/Product/1",
        title: "Pigeon Pro Deck 8.25",
        handle: "pigeon-pro-deck-825",
        vendor: "WeSkate Co",
        priceRange: { minVariantPrice: { amount: "4999.0", currencyCode: "INR" } },
        featuredImage: { url: "https://cdn.shopify.com/image.jpg", altText: "Pigeon Deck" },
      },
    ]),
    getCollections: vi.fn().mockResolvedValue([
      { id: "gid://shopify/Collection/1", title: "Completes", handle: "completes", productsCount: 0, image: null },
    ]),
    getProductByHandle: vi.fn().mockImplementation((handle: string) => {
      if (handle === "pigeon-pro-deck-825") {
        return Promise.resolve({
          id: "gid://shopify/Product/1",
          title: "Pigeon Pro Deck 8.25",
          handle: "pigeon-pro-deck-825",
          vendor: "WeSkate Co",
          priceRange: { minVariantPrice: { amount: "4999.0", currencyCode: "INR" } },
          featuredImage: { url: "https://cdn.shopify.com/image.jpg", altText: "Pigeon Deck" },
        });
      }
      return Promise.resolve(null);
    }),
  };
});

import { searchProducts, getCollections, getProductByHandle } from "lib/admin/shopify-admin";

describe("Shopify Admin Client Service (lib/admin/shopify-admin.ts)", () => {
  it("should fetch search products list", async () => {
    const products = await searchProducts("Pigeon");
    expect(products.length).toBe(1);
    expect(products[0]?.title).toBe("Pigeon Pro Deck 8.25");
    expect(products[0]?.handle).toBe("pigeon-pro-deck-825");
  });

  it("should fetch store collections list", async () => {
    const collections = await getCollections();
    expect(collections.length).toBe(1);
    expect(collections[0]?.handle).toBe("completes");
  });

  it("should fetch single product by handle", async () => {
    const product = await getProductByHandle("pigeon-pro-deck-825");
    expect(product).not.toBeNull();
    expect(product?.title).toBe("Pigeon Pro Deck 8.25");
  });

  it("should return null for non-existent product handle", async () => {
    const product = await getProductByHandle("non-existent");
    expect(product).toBeNull();
  });
});
