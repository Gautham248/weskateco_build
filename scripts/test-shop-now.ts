import {
  buildSlide,
  composeSlides,
  discountPercent,
  readShopNowItems,
  resolveImages,
} from "lib/catalog/shop-now";
import type { ShopNowItemRow } from "lib/admin/queries";
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

async function main() {
  console.log("\nresolveImages — fallbacks and slot order");

  const base = product();

  equal(
    "each slot falls back to the product's nth photo",
    resolveImages(base, [null, null, null]).map((image) => image.url),
    [FIRST, SECOND, THIRD],
  );
  equal(
    "fallback photos keep the product title as alt text when they have none",
    resolveImages(base, [null, null, null])[0]?.altText,
    "Test Deck",
  );

  const twoPhotos = product({ images: [image(FIRST), image(SECOND)] });
  equal(
    "a two-photo product yields two slides, not three",
    resolveImages(twoPhotos, [null, null, null]).map((image) => image.url),
    [FIRST, SECOND],
  );

  const onePhoto = product({ images: [image(FIRST)] });
  equal(
    "a one-photo product yields exactly one slide rather than repeating it",
    resolveImages(onePhoto, [null, null, null]).map((image) => image.url),
    [FIRST],
  );

  const noPhotos = product({ images: [] });
  equal(
    "no photos falls back to the single featuredImage, once",
    resolveImages(noPhotos, [null, null, null]).map((image) => image.url),
    [FEATURED],
  );

  const noImagery = product({
    images: [],
    featuredImage: undefined as unknown as Image,
  });
  equal(
    "a product with no imagery at all yields no slides",
    resolveImages(noImagery, [null, null, null]).length,
    0,
  );

  console.log("\nresolveImages — admin choices");

  const chosen = resolveImages(base, [SECOND, null, null]);
  equal(
    "a chosen photo wins for its own slot, and a fallback that would repeat it is dropped",
    chosen.map((image) => image.url),
    [SECOND, THIRD],
  );

  const uploaded = resolveImages(base, [
    "https://ik.imagekit.io/kyfkw6hca/uploaded-1.jpg",
    null,
    "https://ik.imagekit.io/kyfkw6hca/uploaded-3.jpg",
  ]);
  equal(
    "an uploaded photo is used verbatim, not replaced by a Shopify photo",
    uploaded.map((image) => image.url),
    [
      "https://ik.imagekit.io/kyfkw6hca/uploaded-1.jpg",
      SECOND,
      "https://ik.imagekit.io/kyfkw6hca/uploaded-3.jpg",
    ],
  );
  equal(
    "an uploaded photo falls back to the product title for alt text",
    uploaded[0]?.altText,
    "Test Deck",
  );

  console.log("\ndiscountPercent");

  equal(
    "a genuine markdown rounds to a whole percentage",
    discountPercent(
      { amount: "8499.0", currencyCode: "INR" },
      { amount: "12748.0", currencyCode: "INR" },
    ),
    33,
  );
  equal(
    "an exact markdown is reported exactly",
    discountPercent(
      { amount: "4000.0", currencyCode: "INR" },
      { amount: "5000.0", currencyCode: "INR" },
    ),
    20,
  );
  equal(
    "no compareAtPrice means no discount",
    discountPercent({ amount: "4000.0", currencyCode: "INR" }, null),
    null,
  );
  equal(
    "a compareAtPrice equal to the price is not a discount",
    discountPercent(
      { amount: "4000.0", currencyCode: "INR" },
      { amount: "4000.0", currencyCode: "INR" },
    ),
    null,
  );
  equal(
    "a compareAtPrice below the price is not a discount",
    discountPercent(
      { amount: "4000.0", currencyCode: "INR" },
      { amount: "3500.0", currencyCode: "INR" },
    ),
    null,
  );

  console.log("\nbuildSlide — text, pricing and variants");

  const plain = buildSlide(item(), base);

  equal("handle comes from the product", plain.handle, "test-deck");
  equal("title comes from the product", plain.title, "Test Deck");
  equal("vendor comes from the product", plain.vendor, "WeSkate");
  equal("price uses minVariantPrice", plain.price.amount, "4299.0");
  equal(
    "compareAtPrice is null when the variant has none",
    plain.compareAtPrice,
    null,
  );
  equal("one variant means no picker needed", plain.hasVariants, false);

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
  equal("the discount is derived from it", onSale.discountPercent, 28);

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

  console.log("\nbuildSlide — payload narrowing");

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

  console.log("\nreadShopNowItems");

  // The contract is that a failed item read hides the section rather than
  // throwing into the homepage render. Asserted on the resolved value rather
  // than on emptiness, because the count legitimately depends on whether a
  // database is reachable and populated.
  const read = await readShopNowItems().then(
    (rows) => ({ ok: Array.isArray(rows), rows }),
    () => ({ ok: false, rows: [] as ShopNowItemRow[] }),
  );

  check("a Shop Now item read never throws into the homepage render", read.ok);
  console.log(`      (read resolved with ${read.rows.length} row(s))`);

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
