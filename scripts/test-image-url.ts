import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";

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

const SHOPIFY =
  "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475";
const SHOPIFY_HASHED =
  "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegumfullsetup2_8f920556-4507-4689-b2f6-03d35ec49970.png?v=1777627714";
const IMAGEKIT = "https://ik.imagekit.io/kyfkw6hca/covers/deck.webp";

function main() {
  console.log("\nshopifyImageUrl");

  equal(
    "a shopify url gains a width without losing its version parameter",
    shopifyImageUrl(SHOPIFY, 800),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475&width=800",
  );

  // The whole point of the module: the optimizer downloads the source, and a
  // 16 MB original is what makes it time out at 500.
  check(
    "the original is never requested without a width",
    shopifyImageUrl(SHOPIFY, SHOPIFY_IMAGE_WIDTH.card).includes("width=1024"),
  );

  equal(
    "a hashed filename is resized too",
    shopifyImageUrl(SHOPIFY_HASHED, 800),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegumfullsetup2_8f920556-4507-4689-b2f6-03d35ec49970.png?v=1777627714&width=800",
  );

  equal(
    "a url with no query string gains one",
    shopifyImageUrl(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png",
      800,
    ),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?width=800",
  );

  equal(
    "an existing width is replaced, not duplicated",
    shopifyImageUrl(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?v=1&width=1200",
      800,
    ),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/deck.png?v=1&width=800",
  );

  equal(
    "a caller may ask for a smaller size than a hardcoded one",
    shopifyImageUrl(
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/griptape.png?width=1200",
      256,
    ),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/griptape.png?width=256",
  );

  // Admin overrides can swap a product image for an uploaded one, so the helper is
  // deliberately wrapped around URLs whose host is not known at the call site.
  equal(
    "an imagekit url is left alone",
    shopifyImageUrl(IMAGEKIT, 800),
    IMAGEKIT,
  );

  equal(
    "a local asset is left alone",
    shopifyImageUrl("/icons/logo.svg", 800),
    "/icons/logo.svg",
  );

  equal(
    "a shopify-looking host that is not the cdn is left alone",
    shopifyImageUrl("https://shopify.com/s/files/1/deck.png", 800),
    "https://shopify.com/s/files/1/deck.png",
  );

  equal("an empty url is left alone", shopifyImageUrl("", 800), "");

  equal(
    "a non-numeric width is ignored rather than producing a broken url",
    shopifyImageUrl(SHOPIFY, Number.NaN),
    SHOPIFY,
  );

  equal(
    "a zero width is ignored",
    shopifyImageUrl(SHOPIFY, 0),
    SHOPIFY,
  );

  equal(
    "a negative width is ignored",
    shopifyImageUrl(SHOPIFY, -800),
    SHOPIFY,
  );

  equal(
    "a fractional width is rounded to a whole pixel",
    shopifyImageUrl(SHOPIFY, 799.6),
    "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/bubblegum4.png?v=1777626475&width=800",
  );

  check(
    "the three buckets increase in size",
    SHOPIFY_IMAGE_WIDTH.thumb <
      SHOPIFY_IMAGE_WIDTH.card &&
      SHOPIFY_IMAGE_WIDTH.card < SHOPIFY_IMAGE_WIDTH.hero,
    "a thumb being larger than a hero would mean the buckets were mis-ordered",
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main();
