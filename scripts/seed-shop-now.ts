import { config } from "dotenv";
import { SHOPIFY_GRAPHQL_API_ENDPOINT } from "lib/constants";
import { saveShopNowItems } from "lib/admin/queries";

config({ path: ".env" });

/**
 * One-off rollout seed: gives the homepage Shop Now row a real starting state by
 * picking products at random from the live Shopify catalog.
 *
 * Talks to the Storefront API directly rather than through lib/shopify: those
 * getters call cacheTag(), which throws outside a Next.js request scope.
 */

const POOL_SIZE = 50;
const ITEM_COUNT = 8;

type SeedProduct = {
  id: string;
  handle: string;
  title: string;
};

const SEED_QUERY = /* GraphQL */ `
  query SeedShopNow($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
      }
    }
  }
`;

async function fetchProducts(): Promise<SeedProduct[]> {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!rawDomain || !token) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN must both be set.",
    );
  }

  const domain = rawDomain.startsWith("http")
    ? rawDomain
    : `https://${rawDomain}`;

  const response = await fetch(`${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: SEED_QUERY,
      variables: { first: POOL_SIZE },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify responded with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: { products?: { nodes?: SeedProduct[] } };
    errors?: { message: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data?.products?.nodes ?? [];
}

function pickRandom<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[i];
    const b = shuffled[j];

    if (a === undefined || b === undefined) {
      continue;
    }

    shuffled[i] = b;
    shuffled[j] = a;
  }

  return shuffled.slice(0, count);
}

async function main() {
  const pool = await fetchProducts();

  if (pool.length === 0) {
    console.error("No products returned by Shopify — nothing seeded.");
    process.exit(1);
  }

  const picked = pickRandom(pool, Math.min(ITEM_COUNT, pool.length));

  await saveShopNowItems(
    picked.map((product) => ({
      productHandle: product.handle,
      shopifyProductId: product.id,
      imageUrl1: null,
      imageUrl2: null,
      imageUrl3: null,
    })),
  );

  console.log(
    `Seeded ${picked.length} of ${pool.length} available product(s) into shop_now_items:`,
  );

  for (const [index, product] of picked.entries()) {
    console.log(`  ${index + 1}. ${product.title} (${product.handle})`);
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
