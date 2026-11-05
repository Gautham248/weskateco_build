import { applyOverride, getOverridesForHandles } from "lib/catalog/overrides";
import type { Image, Product } from "lib/shopify/types";
import { afterEach, describe, expect, it, vi } from "vitest";

function image(url: string, altText = ""): Image {
  return { url, altText, width: 1000, height: 1000 };
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
      maxVariantPrice: { amount: "100.00", currencyCode: "INR" },
      minVariantPrice: { amount: "90.00", currencyCode: "INR" },
    },
    variants: [
      {
        id: "var-1",
        title: "8.0",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "8.0" }],
        price: { amount: "90.00", currencyCode: "INR" },
        compareAtPrice: null,
      },
    ],
    featuredImage: image("https://cdn.shopify.com/s/files/1.jpg"),
    images: [
      image("https://cdn.shopify.com/s/files/1.jpg"),
      image("https://cdn.shopify.com/s/files/2.jpg"),
    ],
    seo: { title: "Test Deck", description: "SEO description" },
    metafields: [],
    tags: [],
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function override(overrides: Partial<Parameters<typeof applyOverride>[1]>) {
  return {
    title: null,
    descriptionHtml: null,
    galleryMode: "append" as const,
    coverImageUrl: null,
    removedImageUrls: [],
    images: [],
    ...overrides,
  };
}

const base = product();

describe("applyOverride", () => {
  it("no override returns the product unchanged", () => {
    expect(applyOverride(base, undefined)).toEqual(base);
  });

  describe("title", () => {
    const titled = applyOverride(base, override({ title: "New Title" }));

    it("title override replaces the title", () => {
      expect(titled.title).toBe("New Title");
    });

    it("title override keeps the existing images", () => {
      expect(titled.images).toEqual(base.images);
    });

    it("title override keeps the existing description", () => {
      expect(titled.descriptionHtml).toBe(base.descriptionHtml);
    });

    it("seo.title follows a title that matched the product title", () => {
      expect(titled.seo.title).toBe("New Title");
    });

    it("a deliberately different seo.title is left alone", () => {
      const customSeo = product({
        seo: { title: "Hand-written SEO", description: "d" },
      });
      const customSeoOverridden = applyOverride(
        customSeo,
        override({ title: "New Title" }),
      );

      expect(customSeoOverridden.seo.title).toBe("Hand-written SEO");
    });
  });

  describe("description", () => {
    const described = applyOverride(
      base,
      override({ descriptionHtml: "<p>Fresh <strong>copy</strong></p>" }),
    );

    it("descriptionHtml override replaces the HTML", () => {
      expect(described.descriptionHtml).toBe(
        "<p>Fresh <strong>copy</strong></p>",
      );
    });

    it("description override strips tags for the plain-text fallback", () => {
      expect(described.description).toBe("Fresh copy");
    });
  });
});

describe("gallery", () => {
  describe("append", () => {
    const appended = applyOverride(
      base,
      override({
        images: [image("https://ik.imagekit.io/kyfkw6hca/a.jpg", "A")],
      }),
    );

    it("append puts Shopify images first", () => {
      expect(appended.images[0]?.url).toBe(base.images[0]?.url);
    });

    it("append puts Shopify images second", () => {
      expect(appended.images[1]?.url).toBe(base.images[1]?.url);
    });

    it("append puts the override image last", () => {
      expect(appended.images[2]?.url).toBe(
        "https://ik.imagekit.io/kyfkw6hca/a.jpg",
      );
    });

    it("append keeps featuredImage on the Shopify cover", () => {
      expect(appended.featuredImage.url).toBe(base.featuredImage.url);
    });
  });

  describe("replace", () => {
    const replaced = applyOverride(
      base,
      override({
        galleryMode: "replace",
        images: [image("https://ik.imagekit.io/kyfkw6hca/a.jpg")],
      }),
    );

    it("replace yields a single image", () => {
      expect(replaced.images).toHaveLength(1);
    });

    it("replace drops every Shopify image", () => {
      expect(replaced.images[0]?.url).toBe(
        "https://ik.imagekit.io/kyfkw6hca/a.jpg",
      );
    });

    it("replace promotes the only image to featuredImage", () => {
      expect(replaced.featuredImage.url).toBe(
        "https://ik.imagekit.io/kyfkw6hca/a.jpg",
      );
    });
  });

  describe("removedImageUrls", () => {
    const removed = applyOverride(
      base,
      override({ removedImageUrls: [base.images[0]!.url] }),
    );

    it("removing one Shopify image leaves the rest", () => {
      expect(removed.images).toHaveLength(1);
    });

    it("removing drops exactly the named URL", () => {
      expect(removed.images[0]?.url).toBe(base.images[1]?.url);
    });
  });

  describe("coverImageUrl", () => {
    const covered = applyOverride(
      base,
      override({ coverImageUrl: base.images[1]!.url }),
    );

    it("coverImageUrl drives featuredImage", () => {
      expect(covered.featuredImage.url).toBe(base.images[1]!.url);
    });

    it("the cover is still present in the full gallery", () => {
      expect(covered.images.map((item) => item.url)).toContain(
        base.images[1]!.url,
      );
    });
  });

  it("an override image duplicating a Shopify URL is not duplicated", () => {
    const deduped = applyOverride(
      base,
      override({ images: [image(base.images[0]!.url)] }),
    );

    expect(deduped.images).toHaveLength(2);
  });

  it("with images remaining, featuredImage falls back to a surviving image", () => {
    const removedCover = applyOverride(
      base,
      override({ removedImageUrls: [base.images[0]!.url] }),
    );

    expect(removedCover.featuredImage.url).toBe(base.images[1]!.url);
  });

  describe("no images at all", () => {
    const emptied = applyOverride(
      product({
        images: [],
        featuredImage: image("https://cdn.shopify.com/s/files/f.jpg"),
      }),
      override({ galleryMode: "replace" }),
    );

    it("no images at all keeps the Shopify featuredImage", () => {
      expect(emptied.featuredImage.url).toBe(
        "https://cdn.shopify.com/s/files/f.jpg",
      );
    });

    it("no images at all yields an empty gallery", () => {
      expect(emptied.images).toHaveLength(0);
    });
  });
});

describe("applyOverride in other languages", () => {
  const hindi = product({
    title: "टेस्ट डेक",
    description: "हिंदी विवरण",
    descriptionHtml: "<p>हिंदी विवरण</p>",
    seo: { title: "टेस्ट डेक", description: "SEO विवरण" },
  });
  const edited = override({
    title: "Edited English Title",
    descriptionHtml: "<p>Edited English copy</p>",
    coverImageUrl: "https://cdn.shopify.com/s/files/2.jpg",
    images: [image("https://ik.imagekit.io/weskate/extra.jpg")],
  });
  const result = applyOverride(hindi, edited, { includeText: false });

  it("keeps Shopify's translated title, description and SEO title", () => {
    expect(result.title).toBe("टेस्ट डेक");
    expect(result.description).toBe("हिंदी विवरण");
    expect(result.descriptionHtml).toBe("<p>हिंदी विवरण</p>");
    expect(result.seo).toEqual(hindi.seo);
  });

  it("still applies the photo overrides", () => {
    expect(result.images.map((each) => each.url)).toEqual([
      "https://cdn.shopify.com/s/files/1.jpg",
      "https://cdn.shopify.com/s/files/2.jpg",
      "https://ik.imagekit.io/weskate/extra.jpg",
    ]);
    expect(result.featuredImage.url).toBe(
      "https://cdn.shopify.com/s/files/2.jpg",
    );
  });

  it("applies the text overrides by default", () => {
    const english = applyOverride(base, edited);
    expect(english.title).toBe("Edited English Title");
    expect(english.descriptionHtml).toBe("<p>Edited English copy</p>");
  });
});

describe("getOverridesForHandles", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("an empty handle list", () => {
    it("an empty handle list short-circuits", async () => {
      const empty = await getOverridesForHandles([]);

      expect(empty.size).toBe(0);
    });

    it("the short-circuit returns a Map", async () => {
      const empty = await getOverridesForHandles([]);

      expect(empty).toBeInstanceOf(Map);
    });
  });

  // With no reachable database configured, the read must swallow the failure and
  // return an empty Map rather than throwing into the storefront render path.
  // DATABASE_URL is cleared explicitly so the result does not depend on the
  // developer's environment; lib/db then throws on first use, which is the
  // failure this fallback exists for.
  it("a failing database read degrades to an empty Map", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const resilient = await getOverridesForHandles([
      "definitely-not-a-real-handle",
    ]);

    expect(resilient).toBeInstanceOf(Map);
    expect(resilient.size).toBe(0);
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load product overrides; serving Shopify data as-is:",
      expect.any(Error),
    );
  });
});
