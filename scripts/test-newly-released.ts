import {
  buildSlide,
  composeSlides,
  readNewlyReleasedItems,
} from "lib/catalog/newly-released";
import type { NewlyReleasedItemRow } from "lib/admin/queries";
import type { Image, Product, ProductVariant } from "lib/shopify/types";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

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

async function main() {
  console.log("\nbuildSlide — photo resolution");

  const base = product();
  const plain = buildSlide(item(), base);

  equal(
    "card falls back to the first product photo",
    plain.cardImage?.url,
    base.images[0]?.url,
  );
  equal(
    "hero falls back to the second product photo",
    plain.heroImage?.url,
    base.images[1]?.url,
  );

  const oneImage = buildSlide(
    item(),
    product({ images: [image("https://cdn.shopify.com/s/files/only.jpg")] }),
  );
  equal(
    "a single photo is used for both slots (card)",
    oneImage.cardImage?.url,
    "https://cdn.shopify.com/s/files/only.jpg",
  );
  equal(
    "a single photo is used for both slots (hero)",
    oneImage.heroImage?.url,
    "https://cdn.shopify.com/s/files/only.jpg",
  );

  const noImages = buildSlide(item(), product({ images: [] }));
  equal(
    "no photos falls back to featuredImage (card)",
    noImages.cardImage?.url,
    "https://cdn.shopify.com/s/files/featured.jpg",
  );
  equal(
    "no photos falls back to featuredImage (hero)",
    noImages.heroImage?.url,
    "https://cdn.shopify.com/s/files/featured.jpg",
  );

  const chosen = buildSlide(
    item({
      cardImageUrl: "https://cdn.shopify.com/s/files/second.jpg",
      heroImageUrl: "https://cdn.shopify.com/s/files/first.jpg",
    }),
    base,
  );
  equal("item card photo wins", chosen.cardImage?.url, base.images[1]?.url);
  equal("item hero photo wins", chosen.heroImage?.url, base.images[0]?.url);
  equal(
    "a chosen photo keeps its own alt text",
    chosen.cardImage?.altText,
    "Test Deck",
  );

  const uploaded = buildSlide(
    item({
      cardImageUrl: "https://ik.imagekit.io/kyfkw6hca/uploaded-card.jpg",
      heroImageUrl: "https://ik.imagekit.io/kyfkw6hca/uploaded-hero.jpg",
    }),
    base,
  );

  equal(
    "an uploaded card photo is used verbatim, not replaced by a Shopify photo",
    uploaded.cardImage?.url,
    "https://ik.imagekit.io/kyfkw6hca/uploaded-card.jpg",
  );
  equal(
    "an uploaded hero photo is used verbatim",
    uploaded.heroImage?.url,
    "https://ik.imagekit.io/kyfkw6hca/uploaded-hero.jpg",
  );
  equal(
    "an uploaded photo falls back to the product title for alt text",
    uploaded.cardImage?.altText,
    "Test Deck",
  );
  equal(
    "an uploaded photo carries no dimensions, so hero framing falls back",
    uploaded.heroAspectRatio,
    null,
  );

  console.log("\nbuildSlide — text and pricing");

  equal("title comes from the product", plain.title, "Test Deck");
  equal("subtitle falls back to the vendor", plain.subtitle, "WeSkate");

  equal(
    "an explicit subtitle wins",
    buildSlide(item({ subtitle: "Street Series" }), base).subtitle,
    "Street Series",
  );
  equal(
    "a whitespace subtitle still falls back to the vendor",
    buildSlide(item({ subtitle: "   " }), base).subtitle,
    "WeSkate",
  );

  equal("price uses minVariantPrice", plain.price.amount, "4299.0");
  equal(
    "compareAtPrice is null when the variant has none",
    plain.compareAtPrice,
    null,
  );

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
  equal(
    "compareAtPrice is carried when present",
    onSale.compareAtPrice?.amount,
    "5999.0",
  );

  console.log("\nbuildSlide — variants and availability");

  equal("one variant means no picker needed", plain.hasVariants, false);
  equal(
    "two variants means the picker is needed",
    buildSlide(
      item(),
      product({ variants: [variant("var-1"), variant("var-2")] }),
    ).hasVariants,
    true,
  );
  equal(
    "sold-out is carried through",
    buildSlide(item(), product({ availableForSale: false })).availableForSale,
    false,
  );

  console.log("\nbuildSlide — hero framing and payload");

  equal(
    "aspect ratio is derived from the hero photo",
    plain.heroAspectRatio,
    2,
  );
  equal(
    "aspect ratio is null when the photo has no dimensions",
    buildSlide(
      item(),
      product({
        images: [image("https://cdn.shopify.com/s/files/a.jpg", 0, 0)],
      }),
    ).heroAspectRatio,
    null,
  );

  equal(
    "metafields are stripped from the client payload",
    plain.product.metafields,
    [],
  );
  equal(
    "descriptions are stripped from the client payload",
    plain.product.descriptionHtml,
    "",
  );
  equal(
    "collection edges are stripped from the client payload",
    plain.product.collections,
    undefined,
  );
  equal(
    "variants survive, so add-to-cart still works",
    plain.product.variants.length,
    1,
  );

  console.log("\ncomposeSlides");

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

  equal(
    "stored order is preserved",
    composeSlides(threeItems, threeProducts).map((slide) => slide.handle),
    ["a", "b", "c"],
  );

  const withMissing = composeSlides(threeItems, [
    threeProducts[0],
    undefined,
    threeProducts[2],
  ]);

  equal(
    "an item whose product is gone is dropped",
    withMissing.map((slide) => slide.handle),
    ["a", "c"],
  );
  equal("the surviving items still render", withMissing.length, 2);
  equal("no items yields no slides", composeSlides([], []).length, 0);

  console.log("\nreadNewlyReleasedItems");

  // With no reachable database configured, the read must degrade to an empty
  // list so the homepage hides the section instead of throwing.
  const resilient = await readNewlyReleasedItems();

  check(
    "a failing database read degrades to an empty list",
    Array.isArray(resilient) && resilient.length === 0,
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
