const STOREFRONT_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const ENDPOINT = `https://${STOREFRONT_DOMAIN}/api/2025-01/graphql.json`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export interface AdminProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string | null } | null;
}

export interface AdminCollection {
  id: string;
  title: string;
  handle: string;
  productsCount: number;
  image: { url: string } | null;
}

export async function searchProducts(query: string = ""): Promise<AdminProduct[]> {
  const gql = `
    query SearchProducts($query: String!) {
      products(first: 50, query: $query, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            vendor
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ products: { edges: { node: AdminProduct }[] } }>(gql, { query });
  return data.products.edges.map((e) => e.node);
}

export async function getProductsByCollection(collectionHandle: string): Promise<AdminProduct[]> {
  const gql = `
    query GetProductsByCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              vendor
              priceRange {
                minVariantPrice { amount currencyCode }
              }
              featuredImage { url altText }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ collection: { products: { edges: { node: AdminProduct }[] } } | null }>(gql, { handle: collectionHandle });
  return data.collection?.products.edges.map((e) => e.node) ?? [];
}

export async function getCollections(): Promise<AdminCollection[]> {
  const gql = `
    query GetCollections {
      collections(first: 100, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            image { url }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ collections: { edges: { node: Omit<AdminCollection, 'productsCount'> }[] } }>(gql);
  return data.collections.edges.map((e) => ({ ...e.node, productsCount: 0 }));
}

export async function getProductByHandle(handle: string): Promise<AdminProduct | null> {
  const gql = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        featuredImage { url altText }
      }
    }
  `;
  const data = await shopifyFetch<{ product: AdminProduct | null }>(gql, { handle });
  return data.product;
}
