import type { NewlyReleasedItemRow } from "lib/admin/queries";
import {
  buildSlide,
  composeSlides,
  readNewlyReleasedItems,
} from "lib/catalog/newly-released";
import type { Image, Product, ProductVariant } from "lib/shopify/types";
import { describe, expect, it } from "vitest";

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
    featuredImage: image("https://cdn.shopify.com/s/files/featured.jpg"),
    images: [
      image("https://cdn.shopify.com/s/files/first.jpg"),
      image("https://cdn.shopify.com/s/files/second.jpg"),
    ],
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
    tags: ["newly-released"],
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function item(
  overrides: Partial<NewlyReleasedItemRow> = {},
): NewlyReleasedItemRow {
  return {
    productHandle: "test-deck",
    shopifyProductId: "gid://shopify/Product/1",
    cardImageUrl: null,
    heroImageUrl: null,
    subtitle: null,
    ...overrides,
  };
}

const base = product();
const plain = buildSlide(item(), base);

describe("buildSlide — photo resolution", () => {
  it("card falls back to the first product photo", () => {
    expect(plain.cardImage?.url).toBe(base.images[0]?.url);
  });

  it("hero falls back to the second product photo", () => {
    expect(plain.heroImage?.url).toBe(base.images[1]?.url);
  });

  describe("with a single photo", () => {
    const oneImage = buildSlide(
      item(),
      product({ images: [image("https://cdn.shopify.com/s/files/only.jpg")] }),
    );

    it("a single photo is used for both slots (card)", () => {
      expect(oneImage.cardImage?.url).toBe(
        "https://cdn.shopify.com/s/files/only.jpg",
      );
    });

    it("a single photo is used for both slots (hero)", () => {
      expect(oneImage.heroImage?.url).toBe(
        "https://cdn.shopify.com/s/files/only.jpg",
      );
    });
  });

  describe("with no photos", () => {
    const noImages = buildSlide(item(), product({ images: [] }));

    it("no photos falls back to featuredImage (card)", () => {
      expect(noImages.cardImage?.url).toBe(
        "https://cdn.shopify.com/s/files/featured.jpg",
      );
    });

    it("no photos falls back to featuredImage (hero)", () => {
      expect(noImages.heroImage?.url).toBe(
        "https://cdn.shopify.com/s/files/featured.jpg",
      );
    });
  });

  describe("with photos chosen on the item", () => {
    const chosen = buildSlide(
      item({
        cardImageUrl: "https://cdn.shopify.com/s/files/second.jpg",
        heroImageUrl: "https://cdn.shopify.com/s/files/first.jpg",
      }),
      base,
    );

    it("item card photo wins", () => {
      expect(chosen.cardImage?.url).toBe(base.images[1]?.url);
    });

    it("item hero photo wins", () => {
      expect(chosen.heroImage?.url).toBe(base.images[0]?.url);
    });

    it("a chosen photo keeps its own alt text", () => {
      expect(chosen.cardImage?.altText).toBe("Test Deck");
    });
  });

  describe("with uploaded photos", () => {
    const uploaded = buildSlide(
      item({
        cardImageUrl: "https://ik.imagekit.io/kyfkw6hca/uploaded-card.jpg",
        heroImageUrl: "https://ik.imagekit.io/kyfkw6hca/uploaded-hero.jpg",
      }),
      base,
    );

    it("an uploaded card photo is used verbatim, not replaced by a Shopify photo", () => {
      expect(uploaded.cardImage?.url).toBe(
        "https://ik.imagekit.io/kyfkw6hca/uploaded-card.jpg",
      );
    });

    it("an uploaded hero photo is used verbatim", () => {
      expect(uploaded.heroImage?.url).toBe(
        "https://ik.imagekit.io/kyfkw6hca/uploaded-hero.jpg",
      );
    });

    it("an uploaded photo falls back to the product title for alt text", () => {
      expect(uploaded.cardImage?.altText).toBe("Test Deck");
    });

    it("an uploaded photo carries no dimensions, so hero framing falls back", () => {
      expect(uploaded.heroAspectRatio).toBeNull();
    });
  });
});

describe("buildSlide — text and pricing", () => {
  it("title comes from the product", () => {
    expect(plain.title).toBe("Test Deck");
  });

  it("subtitle falls back to the vendor", () => {
    expect(plain.subtitle).toBe("WeSkate");
  });

  it("an explicit subtitle wins", () => {
    expect(buildSlide(item({ subtitle: "Street Series" }), base).subtitle).toBe(
      "Street Series",
    );
  });

  it("a whitespace subtitle still falls back to the vendor", () => {
    expect(buildSlide(item({ subtitle: "   " }), base).subtitle).toBe(
      "WeSkate",
    );
  });

  it("price uses minVariantPrice", () => {
    expect(plain.price.amount).toBe("4299.0");
  });

  it("compareAtPrice is null when the variant has none", () => {
    expect(plain.compareAtPrice).toBeNull();
  });

  it("compareAtPrice is carried when present", () => {
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
    expect(onSale.compareAtPrice?.amount).toBe("5999.0");
  });
});

describe("buildSlide — variants and availability", () => {
  it("one variant means no picker needed", () => {
    expect(plain.hasVariants).toBe(false);
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
      buildSlide(item(), product({ availableForSale: false })).availableForSale,
    ).toBe(false);
  });
});

describe("buildSlide — hero framing and payload", () => {
  it("aspect ratio is derived from the hero photo", () => {
    expect(plain.heroAspectRatio).toBe(2);
  });

  it("aspect ratio is null when the photo has no dimensions", () => {
    expect(
      buildSlide(
        item(),
        product({
          images: [image("https://cdn.shopify.com/s/files/a.jpg", 0, 0)],
        }),
      ).heroAspectRatio,
    ).toBeNull();
  });

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

  describe("with a missing product", () => {
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

describe("readNewlyReleasedItems", () => {
  // The contract is that a failed item read hides the section rather than
  // throwing into the homepage render. Asserted on the resolved value rather
  // than on emptiness, because the count legitimately depends on whether a
  // database is reachable and populated.
  it("a Newly Released item read never throws into the homepage render", async () => {
    await expect(readNewlyReleasedItems()).resolves.toEqual(expect.any(Array));
  });
});
