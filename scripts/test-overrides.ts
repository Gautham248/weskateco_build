import { applyOverride, getOverridesForHandles } from "lib/catalog/overrides";
import type { Image, Product } from "lib/shopify/types";

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

async function main() {
  console.log("\napplyOverride");

  const base = product();

  equal(
    "no override returns the product unchanged",
    applyOverride(base, undefined),
    base,
  );

  const titled = applyOverride(base, override({ title: "New Title" }));

  equal("title override replaces the title", titled.title, "New Title");
  equal("title override keeps the existing images", titled.images, base.images);
  equal(
    "title override keeps the existing description",
    titled.descriptionHtml,
    base.descriptionHtml,
  );
  equal(
    "seo.title follows a title that matched the product title",
    titled.seo.title,
    "New Title",
  );

  const customSeo = product({
    seo: { title: "Hand-written SEO", description: "d" },
  });
  const customSeoOverridden = applyOverride(
    customSeo,
    override({ title: "New Title" }),
  );

  equal(
    "a deliberately different seo.title is left alone",
    customSeoOverridden.seo.title,
    "Hand-written SEO",
  );

  const described = applyOverride(
    base,
    override({ descriptionHtml: "<p>Fresh <strong>copy</strong></p>" }),
  );

  equal(
    "descriptionHtml override replaces the HTML",
    described.descriptionHtml,
    "<p>Fresh <strong>copy</strong></p>",
  );
  equal(
    "description override strips tags for the plain-text fallback",
    described.description,
    "Fresh copy",
  );

  console.log("\ngallery");

  const appended = applyOverride(
    base,
    override({
      images: [image("https://ik.imagekit.io/kyfkw6hca/a.jpg", "A")],
    }),
  );

  equal(
    "append puts Shopify images first",
    appended.images[0]?.url,
    base.images[0]?.url,
  );
  equal(
    "append puts Shopify images second",
    appended.images[1]?.url,
    base.images[1]?.url,
  );
  equal(
    "append puts the override image last",
    appended.images[2]?.url,
    "https://ik.imagekit.io/kyfkw6hca/a.jpg",
  );
  equal(
    "append keeps featuredImage on the Shopify cover",
    appended.featuredImage.url,
    base.featuredImage.url,
  );

  const replaced = applyOverride(
    base,
    override({
      galleryMode: "replace",
      images: [image("https://ik.imagekit.io/kyfkw6hca/a.jpg")],
    }),
  );

  equal("replace yields a single image", replaced.images.length, 1);
  equal(
    "replace drops every Shopify image",
    replaced.images[0]?.url,
    "https://ik.imagekit.io/kyfkw6hca/a.jpg",
  );
  equal(
    "replace promotes the only image to featuredImage",
    replaced.featuredImage.url,
    "https://ik.imagekit.io/kyfkw6hca/a.jpg",
  );

  const removed = applyOverride(
    base,
    override({ removedImageUrls: [base.images[0]!.url] }),
  );

  equal("removing one Shopify image leaves the rest", removed.images.length, 1);
  equal(
    "removing drops exactly the named URL",
    removed.images[0]?.url,
    base.images[1]?.url,
  );

  const covered = applyOverride(
    base,
    override({ coverImageUrl: base.images[1]!.url }),
  );

  equal(
    "coverImageUrl drives featuredImage",
    covered.featuredImage.url,
    base.images[1]!.url,
  );
  equal(
    "the cover is still present in the full gallery",
    covered.images.some((item) => item.url === base.images[1]!.url),
    true,
  );

  const deduped = applyOverride(
    base,
    override({ images: [image(base.images[0]!.url)] }),
  );

  equal(
    "an override image duplicating a Shopify URL is not duplicated",
    deduped.images.length,
    2,
  );

  const removedCover = applyOverride(
    base,
    override({ removedImageUrls: [base.images[0]!.url] }),
  );

  equal(
    "with images remaining, featuredImage falls back to a surviving image",
    removedCover.featuredImage.url,
    base.images[1]!.url,
  );

  const emptied = applyOverride(
    product({
      images: [],
      featuredImage: image("https://cdn.shopify.com/s/files/f.jpg"),
    }),
    override({ galleryMode: "replace" }),
  );

  equal(
    "no images at all keeps the Shopify featuredImage",
    emptied.featuredImage.url,
    "https://cdn.shopify.com/s/files/f.jpg",
  );
  equal("no images at all yields an empty gallery", emptied.images.length, 0);

  console.log("\ngetOverridesForHandles");

  const empty = await getOverridesForHandles([]);

  check("an empty handle list short-circuits", empty.size === 0);
  check("the short-circuit returns a Map", empty instanceof Map);

  // With no reachable database configured, the read must swallow the failure and
  // return an empty Map rather than throwing into the storefront render path.
  const resilient = await getOverridesForHandles([
    "definitely-not-a-real-handle",
  ]);

  check(
    "a failing database read degrades to an empty Map",
    resilient instanceof Map && resilient.size === 0,
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
