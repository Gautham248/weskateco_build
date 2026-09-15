import { config } from "dotenv";
import { SHOPIFY_GRAPHQL_API_ENDPOINT } from "lib/constants";
import { saveNewlyReleasedItems } from "lib/admin/queries";

config({ path: ".env" });

/**
 * One-off rollout seed: gives the homepage carousel a real starting state from
 * the Shopify collection that already exists, so the section is never empty.
 *
 * Talks to the Storefront API directly rather than through lib/shopify: those
 * getters call cacheTag(), which throws outside a Next.js request scope.
 */

const COLLECTION_HANDLE = "newly-released";
const ITEM_COUNT = 2;

type SeedProduct = {
  id: string;
  handle: string;
  title: string;
};

const SEED_QUERY = /* GraphQL */ `
  query SeedNewlyReleased($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first, sortKey: CREATED, reverse: true) {
        nodes {
          id
          handle
          title
        }
      }
    }
  }
`;

async function fetchNewestProducts(): Promise<SeedProduct[]> {
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
      variables: { handle: COLLECTION_HANDLE, first: ITEM_COUNT },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify responded with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: { collection?: { products?: { nodes?: SeedProduct[] } } | null };
    errors?: { message: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data?.collection?.products?.nodes ?? [];
}

async function main() {
  const products = await fetchNewestProducts();

  if (products.length === 0) {
    console.error(
      `No products found in the "${COLLECTION_HANDLE}" collection — nothing seeded.`,
    );
    process.exit(1);
  }

  await saveNewlyReleasedItems(
    products.map((product) => ({
      productHandle: product.handle,
      shopifyProductId: product.id,
      cardImageUrl: null,
      heroImageUrl: null,
      subtitle: null,
    })),
  );

  console.log(
    `Seeded ${products.length} item(s) into newly_released_items, newest first:`,
  );

  for (const [index, product] of products.entries()) {
    console.log(`  ${index + 1}. ${product.title} (${product.handle})`);
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
