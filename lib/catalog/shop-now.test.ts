import type { ShopNowItemRow } from "lib/admin/queries";
import {
  buildSlide,
  composeSlides,
  discountPercent,
  readShopNowItems,
  resolveImages,
} from "lib/catalog/shop-now";
import type { Image, Product, ProductVariant } from "lib/shopify/types";
import { afterEach, describe, expect, it, vi } from "vitest";

function image(url: string, width = 2000, height = 1000, altText = ""): Image {
  return { url, altText, width, height };
}

function variant(
  id: string,
  overrides: Partial<ProductVariant> = {},
): ProductVariant {
  return {
    id,
    title: id,
    availableForSale: true,
    selectedOptions: [{ name: "Size", value: "8.0" }],
    price: { amount: "4299.0", currencyCode: "INR" },
    compareAtPrice: null,
    ...overrides,
  };
}

const FEATURED = "https://cdn.shopify.com/s/files/featured.jpg";
const FIRST = "https://cdn.shopify.com/s/files/first.jpg";
const SECOND = "https://cdn.shopify.com/s/files/second.jpg";
const THIRD = "https://cdn.shopify.com/s/files/third.jpg";

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: "gid://shopify/Product/1",
    handle: "test-deck",
    availableForSale: true,
    title: "Test Deck",
    description: "A plain description",
    descriptionHtml: "<p>A <strong>plain</strong> description</p>",
    vendor: "WeSkate",
    options: [{ id: "opt-1", name: "Size", values: ["8.0"] }],
    priceRange: {
      maxVariantPrice: { amount: "4299.0", currencyCode: "INR" },
      minVariantPrice: { amount: "4299.0", currencyCode: "INR" },
    },
    variants: [variant("var-1")],
    featuredImage: image(FEATURED),
    images: [image(FIRST), image(SECOND), image(THIRD)],
    seo: { title: "Test Deck", description: "SEO description" },
    metafields: [
      {
        key: "deck_width",
        value: "8.0",
        namespace: "configurator",
        type: "number_decimal",
      },
    ],
    collections: {
      edges: [{ node: { handle: "decks", title: "Decks" } }],
    },
    tags: ["shop-now"],
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function item(overrides: Partial<ShopNowItemRow> = {}): ShopNowItemRow {
  return {
    productHandle: "test-deck",
    shopifyProductId: "gid://shopify/Product/1",
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
    ...overrides,
  };
}

const base = product();

describe("resolveImages — fallbacks and slot order", () => {
  it("each slot falls back to the product's nth photo", () => {
    expect(
      resolveImages(base, [null, null, null]).map((image) => image.url),
    ).toEqual([FIRST, SECOND, THIRD]);
  });

  it("fallback photos keep the product title as alt text when they have none", () => {
    expect(resolveImages(base, [null, null, null])[0]?.altText).toBe(
      "Test Deck",
    );
  });

  it("a two-photo product yields two slides, not three", () => {
    const twoPhotos = product({ images: [image(FIRST), image(SECOND)] });

    expect(
      resolveImages(twoPhotos, [null, null, null]).map((image) => image.url),
    ).toEqual([FIRST, SECOND]);
  });

  it("a one-photo product yields exactly one slide rather than repeating it", () => {
    const onePhoto = product({ images: [image(FIRST)] });

    expect(
      resolveImages(onePhoto, [null, null, null]).map((image) => image.url),
    ).toEqual([FIRST]);
  });

  it("no photos falls back to the single featuredImage, once", () => {
    const noPhotos = product({ images: [] });

    expect(
      resolveImages(noPhotos, [null, null, null]).map((image) => image.url),
    ).toEqual([FEATURED]);
  });

  it("a product with no imagery at all yields no slides", () => {
    const noImagery = product({
      images: [],
      featuredImage: undefined as unknown as Image,
    });

    expect(resolveImages(noImagery, [null, null, null])).toHaveLength(0);
  });
});

describe("resolveImages — admin choices", () => {
  it("a chosen photo wins for its own slot, and a fallback that would repeat it is dropped", () => {
    const chosen = resolveImages(base, [SECOND, null, null]);

    expect(chosen.map((image) => image.url)).toEqual([SECOND, THIRD]);
  });

  describe("uploaded photos", () => {
    const uploaded = resolveImages(base, [
      "https://ik.imagekit.io/kyfkw6hca/uploaded-1.jpg",
      null,
      "https://ik.imagekit.io/kyfkw6hca/uploaded-3.jpg",
    ]);

    it("an uploaded photo is used verbatim, not replaced by a Shopify photo", () => {
      expect(uploaded.map((image) => image.url)).toEqual([
        "https://ik.imagekit.io/kyfkw6hca/uploaded-1.jpg",
        SECOND,
        "https://ik.imagekit.io/kyfkw6hca/uploaded-3.jpg",
      ]);
    });

    it("an uploaded photo falls back to the product title for alt text", () => {
      expect(uploaded[0]?.altText).toBe("Test Deck");
    });
  });
});

describe("discountPercent", () => {
  it("a genuine markdown rounds to a whole percentage", () => {
    expect(
      discountPercent(
        { amount: "8499.0", currencyCode: "INR" },
        { amount: "12748.0", currencyCode: "INR" },
      ),
    ).toBe(33);
  });

  it("an exact markdown is reported exactly", () => {
    expect(
      discountPercent(
        { amount: "4000.0", currencyCode: "INR" },
        { amount: "5000.0", currencyCode: "INR" },
      ),
    ).toBe(20);
  });

  it("no compareAtPrice means no discount", () => {
    expect(
      discountPercent({ amount: "4000.0", currencyCode: "INR" }, null),
    ).toBeNull();
  });

  it("a compareAtPrice equal to the price is not a discount", () => {
    expect(
      discountPercent(
        { amount: "4000.0", currencyCode: "INR" },
        { amount: "4000.0", currencyCode: "INR" },
      ),
    ).toBeNull();
  });

  it("a compareAtPrice below the price is not a discount", () => {
    expect(
      discountPercent(
        { amount: "4000.0", currencyCode: "INR" },
        { amount: "3500.0", currencyCode: "INR" },
      ),
    ).toBeNull();
  });
});

describe("buildSlide", () => {
  const plain = buildSlide(item(), base);

  describe("text, pricing and variants", () => {
    it("handle comes from the product", () => {
      expect(plain.handle).toBe("test-deck");
    });

    it("title comes from the product", () => {
      expect(plain.title).toBe("Test Deck");
    });

    it("vendor comes from the product", () => {
      expect(plain.vendor).toBe("WeSkate");
    });

    it("price uses minVariantPrice", () => {
      expect(plain.price.amount).toBe("4299.0");
    });

    it("compareAtPrice is null when the variant has none", () => {
      expect(plain.compareAtPrice).toBeNull();
    });

    it("one variant means no picker needed", () => {
      expect(plain.hasVariants).toBe(false);
    });

    describe("on sale", () => {
      const onSale = buildSlide(
        item(),
        product({
          variants: [
            variant("var-1", {
              compareAtPrice: { amount: "5999.0", currencyCode: "INR" },
            }),
          ],
        }),
      );

      it("compareAtPrice is carried when present", () => {
        expect(onSale.compareAtPrice?.amount).toBe("5999.0");
      });

      it("the discount is derived from it", () => {
        expect(onSale.discountPercent).toBe(28);
      });
    });

    it("two variants means the picker is needed", () => {
      expect(
        buildSlide(
          item(),
          product({ variants: [variant("var-1"), variant("var-2")] }),
        ).hasVariants,
      ).toBe(true);
    });

    it("sold-out is carried through", () => {
      expect(
        buildSlide(item(), product({ availableForSale: false }))
          .availableForSale,
      ).toBe(false);
    });
  });

  describe("payload narrowing", () => {
    it("metafields are stripped from the client payload", () => {
      expect(plain.product.metafields).toEqual([]);
    });

    it("descriptions are stripped from the client payload", () => {
      expect(plain.product.descriptionHtml).toBe("");
    });

    it("collection edges are stripped from the client payload", () => {
      expect(plain.product.collections).toBeUndefined();
    });

    it("variants survive, so add-to-cart still works", () => {
      expect(plain.product.variants).toHaveLength(1);
    });
  });
});

describe("composeSlides", () => {
  const threeItems = [
    item({ productHandle: "a" }),
    item({ productHandle: "b" }),
    item({ productHandle: "c" }),
  ];
  const threeProducts = [
    product({ handle: "a", title: "A" }),
    product({ handle: "b", title: "B" }),
    product({ handle: "c", title: "C" }),
  ];

  it("stored order is preserved", () => {
    expect(
      composeSlides(threeItems, threeProducts).map((slide) => slide.handle),
    ).toEqual(["a", "b", "c"]);
  });

  describe("an item whose product is gone", () => {
    const withMissing = composeSlides(threeItems, [
      threeProducts[0],
      undefined,
      threeProducts[2],
    ]);

    it("an item whose product is gone is dropped", () => {
      expect(withMissing.map((slide) => slide.handle)).toEqual(["a", "c"]);
    });

    it("the surviving items still render", () => {
      expect(withMissing).toHaveLength(2);
    });
  });

  it("no items yields no slides", () => {
    expect(composeSlides([], [])).toHaveLength(0);
  });
});

describe("readShopNowItems", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // The contract is that a failed item read hides the section rather than
  // throwing into the homepage render. The original script asserted only that
  // the read resolved to an array, because the row count depends on whether a
  // database is reachable and populated. Here DATABASE_URL is cleared so the
  // read fails deterministically (lib/db throws on first use) and the fallback
  // is exercised regardless of the developer's environment.
  it("a Shop Now item read never throws into the homepage render", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const rows = await readShopNowItems();

    expect(rows).toEqual([]);
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load Shop Now items; hiding the section for this render:",
      expect.any(Error),
    );
  });
});
