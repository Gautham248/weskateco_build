import {
  listNewlyReleasedItems,
  type NewlyReleasedItemRow,
} from "lib/admin/queries";
import type { Image, Money, Product } from "lib/shopify/types";

/**
 * Framework-free on purpose: this module holds the data read and the pure slide
 * mapping, so test scripts can exercise both without a Next.js runtime.
 */

export type NewlyReleasedSlideImage = {
  url: string;
  altText: string;
};

export type NewlyReleasedSlide = {
  handle: string;
  cardImage: NewlyReleasedSlideImage | null;
  heroImage: NewlyReleasedSlideImage | null;
  title: string;
  subtitle: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  hasVariants: boolean;
  /** heroImage's width/height, so the frame can size itself to any product photo. */
  heroAspectRatio: number | null;
  /** Narrowed product, used for add-to-cart and the quick-buy sidebar. */
  product: Product;
};

type ResolvedImage = {
  url: string;
  altText: string;
  /** The product\u0027s own record, when the choice came from its photos. */
  source: Image | null;
};

/**
 * Resolves one image slot. A chosen URL wins even when it is not one of the
 * product\u0027s photos — that is the uploaded case, and it has to display rather
 * than silently falling back to a Shopify photo.
 */
function resolveImage(
  product: Product,
  chosenUrl: string | null,
  fallbackIndex: number,
): ResolvedImage | null {
  if (chosenUrl) {
    const match =
      product.images.find((image) => image.url === chosenUrl) ?? null;

    return {
      url: chosenUrl,
      altText: match?.altText || product.title,
      source: match,
    };
  }

  const local =
    product.images[fallbackIndex] ??
    product.images[0] ??
    product.featuredImage ??
    null;

  if (!local) {
    return null;
  }

  return {
    url: local.url,
    altText: local.altText || product.title,
    source: local,
  };
}

function aspectRatio(image: Image | undefined | null): number | null {
  if (!image?.width || !image.height) {
    return null;
  }

  return image.width / image.height;
}

/**
 * The admin panel and the storefront only need identity, media, pricing and
 * variants. Blanking the rest keeps 17 metafields and up to 100 collection edges
 * per product out of the homepage's RSC payload.
 */
export function narrowProduct(product: Product): Product {
  return {
    ...product,
    description: "",
    descriptionHtml: "",
    metafields: [],
    collections: undefined,
    seo: { title: product.seo.title || product.title, description: "" },
  };
}

/**
 * Pure and synchronous so it can be tested without a database or Shopify.
 * Item-level photo choices win; otherwise fall back to the product's own photos.
 */
export function buildSlide(
  item: NewlyReleasedItemRow,
  product: Product,
): NewlyReleasedSlide {
  const card = resolveImage(product, item.cardImageUrl, 0);
  const hero = resolveImage(product, item.heroImageUrl, 1);

  return {
    handle: product.handle,
    cardImage: card ? { url: card.url, altText: card.altText } : null,
    heroImage: hero ? { url: hero.url, altText: hero.altText } : null,
    title: product.title,
    subtitle: item.subtitle?.trim() || product.vendor,
    price: product.priceRange.minVariantPrice,
    compareAtPrice: product.variants[0]?.compareAtPrice ?? null,
    availableForSale: product.availableForSale,
    hasVariants: product.variants.length > 1,
    heroAspectRatio: aspectRatio(hero?.source),
    product: narrowProduct(product),
  };
}

/**
 * Maps stored rows onto fetched products, preserving the stored order and
 * dropping any item whose product no longer exists in Shopify.
 */
export function composeSlides(
  items: NewlyReleasedItemRow[],
  products: (Product | undefined)[],
): NewlyReleasedSlide[] {
  const slides: NewlyReleasedSlide[] = [];

  for (const [index, item] of items.entries()) {
    const product = products[index];

    if (!product) {
      continue;
    }

    slides.push(buildSlide(item, product));
  }

  return slides;
}

/**
 * The resilience lives here rather than in the cached wrapper next door, so it
 * can be asserted directly: a database outage must hide the section, never throw
 * into the homepage render.
 */
export async function readNewlyReleasedItems(): Promise<
  NewlyReleasedItemRow[]
> {
  try {
    return await listNewlyReleasedItems();
  } catch (error) {
    console.error(
      "Failed to load newly released items; hiding the section for this render:",
      error,
    );
    return [];
  }
}
