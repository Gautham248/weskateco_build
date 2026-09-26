import storefrontImageLoader from "lib/image-loader";

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

function equal(name: string, actual: string, expected: string) {
  check(name, actual === expected, `expected ${expected}, got ${actual}`);
}

function run() {
  console.log("\nstorefront image loader");

  equal(
    "sends Shopify CDN images directly with responsive parameters",
    storefrontImageLoader({
      src: "https://cdn.shopify.com/s/files/1/product.jpg?v=123",
      width: 750,
      quality: 75,
    }),
    "https://cdn.shopify.com/s/files/1/product.jpg?v=123&width=750&quality=75",
  );

  equal(
    "preserves existing parameters while overriding width and quality",
    storefrontImageLoader({
      src: "https://cdn.shopify.com/s/files/1/product.jpg?v=123&width=1920&q=90",
      width: 1080,
      quality: 60,
    }),
    "https://cdn.shopify.com/s/files/1/product.jpg?v=123&width=1080&quality=60",
  );

  equal(
    "uses the custom Shopify CDN host directly",
    storefrontImageLoader({
      src: "https://weskateco.com/cdn/shop/files/product.jpg?v=123",
      width: 640,
    }),
    "https://weskateco.com/cdn/shop/files/product.jpg?v=123&width=640&quality=75",
  );

  check(
    "keeps Next optimization for non-Shopify custom-domain images",
    storefrontImageLoader({
      src: "https://weskateco.com/media/example.jpg",
      width: 640,
    }).startsWith("/_next/image?url="),
  );

  const imageKit = storefrontImageLoader({
    src: "https://ik.imagekit.io/kyfkw6hca/product.jpg",
    width: 750,
    quality: 80,
  });
  check(
    "keeps Next optimization for ImageKit images",
    imageKit.startsWith(
      "/_next/image?url=https%3A%2F%2Fik.imagekit.io%2Fkyfkw6hca%2Fproduct.jpg&w=750&q=80",
    ),
    imageKit,
  );

  equal(
    "keeps Next optimization for local images",
    storefrontImageLoader({
      src: "/fonts/clash.woff2",
      width: 384,
    }),
    "/_next/image?url=%2Ffonts%2Fclash.woff2&w=384&q=75",
  );

  if (failures.length) {
    console.error(`\n${failures.length} image-loader test(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n${passed} image-loader tests passed.`);
}

run();
