import { withOverrides } from "lib/catalog/overrides";
import {
  HIDDEN_PRODUCT_TAG,
  LOCALE_COOKIE,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import { getShopifyLanguage } from "lib/i18n";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { cookies } from "next/headers";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsPageQuery,
  getProductSitemapEntriesQuery,
  getProductsQuery,
} from "./queries/product";
import { getConfiguratorProductsQuery } from "./queries/configurator";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductSitemapEntriesOperation,
  ProductSitemapEntry,
  ShopifyProductsOperation,
  ShopifyProductsPageOperation,
  ShopifyProductSummary,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = domain ? `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : "";
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

/**
 * True only for connection-establishment failures — a connect timeout, DNS
 * failure, refused connection, or failed TLS handshake — where the request
 * never reached Shopify. Retrying those is safe even for cart mutations.
 * Anything where a response may already have started is deliberately not
 * retried.
 */
export function isTransientConnectError(error: unknown): boolean {
  const cause = (error as { cause?: unknown } | null)?.cause;

  if (cause && typeof cause === "object") {
    const code = (cause as { code?: string }).code;
    if (
      code === "ECONNREFUSED" ||
      code === "ENETUNREACH" ||
      code === "EHOSTUNREACH" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN"
    ) {
      return true;
    }

    // OpenSSL's "ssl/tls alert handshake failure" (alert 40), which Shopify's
    // edge sends now and then. Seen failing a CI build while every other
    // request in the same build succeeded.
    if (code?.startsWith("ERR_SSL_") && code.endsWith("HANDSHAKE_FAILURE")) {
      return true;
    }

    if ((cause as { name?: string }).name === "ConnectTimeoutError") {
      return true;
    }
  }

  return false;
}

/**
 * Hard cap on any single Shopify request. Without it, a dead or stalled
 * upstream sits on undici's default 300s headers timeout — the request looks
 * like a ~5-minute hang (seen as `POST /configurator 404 in 318000ms` plus
 * `UND_ERR_HEADERS_TIMEOUT`) instead of a fast, explainable failure. 15s is
 * far above normal Storefront API latency (typically <1s).
 */
const SHOPIFY_FETCH_TIMEOUT_MS = 15_000;

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
  locale,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
  /**
   * Storefront locale to answer in. Only pass it for queries that declare
   * `$language: LanguageCode = EN` with `@inContext(language: $language)`.
   */
  locale?: string;
}): Promise<{ status: number; body: T } | never> {
  const language = getShopifyLanguage(locale);
  const requestVariables = language ? { ...variables, language } : variables;
  const maxRetries = 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      if (!endpoint) {
        throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not set");
      }

      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": key,
          ...headers,
        },
        body: JSON.stringify({
          ...(query && { query }),
          ...(requestVariables && { variables: requestVariables }),
        }),
        signal: AbortSignal.timeout(SHOPIFY_FETCH_TIMEOUT_MS),
      });

      const body = await result.json();

      if (body.errors) {
        throw body.errors[0];
      }

      return {
        status: result.status,
        body,
      };
    } catch (e) {
      lastError = e;

      if (attempt < maxRetries && isTransientConnectError(e)) {
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
        continue;
      }

      break;
    }
  }

  if (isShopifyError(lastError)) {
    throw {
      cause: lastError.cause?.toString() || "unknown",
      status: lastError.status || 500,
      message: lastError.message,
      query,
    };
  }

  throw {
    error: lastError,
    query,
  };
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    image: collection.image
      ? {
          ...collection.image,
          altText: collection.image.altText || `${collection.title} collection`,
        }
      : null,
    path: `/store/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags?.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
    metafields: product.metafields || [],
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

/** The locale the shopper last browsed in, as recorded by proxy.ts. */
async function shopperLocale(): Promise<string | undefined> {
  return (await cookies()).get(LOCALE_COOKIE)?.value;
}

// The cart's language is fixed when it is created: Shopify opens its checkout
// (and sends order emails) in it, so a cart started on /hi checks out in Hindi.
export async function createCart(
  lineItems?: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    variables: {
      lineItems: lineItems || [],
    },
    locale: await shopperLocale(),
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
  }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

// NOTE: intentionally NOT cached ("use cache"). A cart is per-user live data;
// caching it here intermittently returned stale "empty/missing cart" results,
// which made adds create duplicate carts and refreshes empty the UI.
// Reads the shopper's cart (the cartId cookie) unless given another cart's id.
// Line titles come back in `locale`, defaulting to the locale the shopper last
// browsed in.
export async function getCart(
  id?: string,
  locale?: string,
): Promise<Cart | undefined> {
  const cartId = id ?? (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const cartLocale = locale ?? (await shopperLocale());

  // The connection to Shopify fails intermittently on some networks ("fetch
  // failed" from the HTTP layer). Retry reads with a short backoff so a
  // hiccup degrades into a slightly slower load instead of a lost cart.
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await shopifyFetch<ShopifyCartOperation>({
        query: getCartQuery,
        variables: { cartId },
        locale: cartLocale,
      });
      if (!res.body.data.cart) {
        return undefined;
      }
      return reshapeCart(res.body.data.cart);
    } catch (e) {
      lastError = e;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }
  throw lastError;
}

export async function getCollection(
  handle: string,
  locale?: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle,
    },
    locale,
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  locale,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  locale?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Shopify not configured`,
    );
    return [];
  }

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
    locale,
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return withOverrides(
    reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products)),
    locale,
  );
}

export async function getCollections(locale?: string): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    console.log("Skipping getCollections - Shopify not configured");
    return [
      {
        handle: "",
        title: "All",
        description: "All products",
        seo: {
          title: "All",
          description: "All products",
        },
        path: "/search",
        image: null,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    locale,
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      image: null,
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getMenu for '${handle}' - Shopify not configured`);
    return [];
  }

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

type SitemapProduct = Pick<ProductSitemapEntry, "handle" | "updatedAt">;

/**
 * Every visible product's handle and last update, for the sitemap. Skips the
 * admin override layer (it never changes a product's URL or visibility) and
 * pages through the whole catalog rather than stopping at 100 products.
 */
export async function getProductSitemapEntries(): Promise<SitemapProduct[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const entries: SitemapProduct[] = [];
  let after: string | null = null;

  do {
    const res: { body: ShopifyProductSitemapEntriesOperation } =
      await shopifyFetch<ShopifyProductSitemapEntriesOperation>({
        query: getProductSitemapEntriesQuery,
        variables: { after },
      });
    const { pageInfo, edges } = res.body.data.products;
    for (const { node } of edges) {
      if (!node.tags.includes(HIDDEN_PRODUCT_TAG)) {
        entries.push({ handle: node.handle, updatedAt: node.updatedAt });
      }
    }
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return entries;
}

export async function getPages(): Promise<Page[]> {
  "use cache";
  // No tag: the Shopify webhook doesn't cover page topics, so this refreshes
  // on a timer. Only the sitemap calls it.
  cacheLife("hours");

  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

/**
 * Admin-only. Returns the raw Shopify product WITHOUT the override layer applied,
 * so the editor can show the true Shopify title/description/photos alongside the
 * override fields instead of the already-merged result.
 */
export async function getRawProduct(
  handle: string,
): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(
      `Skipping getRawProduct for '${handle}' - Shopify not configured`,
    );
    return undefined;
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProduct(
  handle: string,
  locale?: string,
): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getProduct for '${handle}' - Shopify not configured`);
    return undefined;
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle,
    },
    locale,
  });

  const product = reshapeProduct(res.body.data.product, false);

  if (!product) {
    return undefined;
  }

  const [merged] = await withOverrides([product], locale);

  return merged;
}

/**
 * What a product page read produced. Three outcomes, not two — see
 * `productReadState` in lib/catalog/product-page.ts for what the page does with them
 * and why a failure must never be confused with a missing product.
 */
export type ProductReadResult =
  | { status: "ok"; product: Product | undefined }
  | { status: "failed" };

/**
 * `getProduct` for a page render, resolving a Shopify failure to a state instead of
 * throwing.
 *
 * Deliberately **not** cached, so an outage is never remembered: only `getProduct`'s own
 * successful result is cached, and the next request asks Shopify again. That is the same
 * arrangement `newly-released-feed.ts` and `shop-now-feed.ts` rely on for the homepage
 * sections — catch around the `"use cache"` function, never inside a cached wrapper that
 * would memorise the failure.
 */
export async function readProductForPage(
  handle: string,
  locale?: string,
): Promise<ProductReadResult> {
  try {
    return { status: "ok", product: await getProduct(handle, locale) };
  } catch (error) {
    console.error(
      `Could not read product "${handle}" from Shopify; the page will show the unavailable state:`,
      error,
    );

    return { status: "failed" };
  }
}

export async function getProductRecommendations(
  productId: string,
  locale?: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId,
    },
    locale,
  });

  return withOverrides(
    reshapeProducts(res.body.data.productRecommendations),
    locale,
  );
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  locale,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  locale?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey,
    },
    locale,
  });

  return withOverrides(
    reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
    locale,
  );
}

export async function getConfiguratorProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getConfiguratorProductsQuery,
  });

  return withOverrides(
    reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
  );
}

/** Safety valve: 4 x 250 products before we stop paging. */
const ADMIN_CATALOG_MAX_PAGES = 4;
const ADMIN_CATALOG_PAGE_SIZE = 250;

export type AdminProductCatalog = {
  items: ShopifyProductSummary[];
  /** True when the catalog is larger than the page cap, so the list is partial. */
  truncated: boolean;
  /**
   * True when the catalog could not be read at all. Distinguishes "Shopify is
   * unreachable" from "there are no products" — an empty list with no explanation
   * reads as the latter, which would be a lie.
   */
  failed: boolean;
};

/**
 * The whole admin catalog in one call, so the admin products page can filter
 * client-side exactly like the storefront does. Sorted by title for a
 * predictable, scannable list.
 *
 * A Shopify outage returns `failed` rather than throwing. The try/catch has to
 * live in here rather than around a call site: an error escaping a "use cache"
 * function surfaces as an unhandled 500 in this Next version even when the caller
 * catches it — which is why all three admin pages using this were 500-ing while
 * Shopify was unreachable.
 *
 * The cost of catching inside is that a failure is cached for this profile, so a
 * transient blip can hold the banner until the entry expires. A visible, explained
 * failure is still better than a broken page.
 */
export async function getAdminProductCatalog(): Promise<AdminProductCatalog> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log("Skipping getAdminProductCatalog - Shopify not configured");
    return { items: [], truncated: false, failed: true };
  }

  try {
    const items: ShopifyProductSummary[] = [];
    let after: string | undefined;
    let hasMore = true;
    let pages = 0;

    while (hasMore && pages < ADMIN_CATALOG_MAX_PAGES) {
      const res = await shopifyFetch<ShopifyProductsPageOperation>({
        query: getProductsPageQuery,
        variables: {
          first: ADMIN_CATALOG_PAGE_SIZE,
          after,
          sortKey: "TITLE",
          reverse: false,
        },
      });

      const connection = res.body.data.products;

      items.push(...removeEdgesAndNodes(connection));

      hasMore = connection.pageInfo.hasNextPage;
      after = connection.pageInfo.endCursor ?? undefined;
      pages += 1;
    }

    return { items, truncated: hasMore, failed: false };
  } catch (error) {
    console.error(
      "Could not read the product catalog from Shopify; the admin product lists will be empty:",
      error,
    );

    return { items: [], truncated: false, failed: true };
  }
}
