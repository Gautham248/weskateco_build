import type { Product } from "lib/shopify/types";

// Builders for schema.org structured data (JSON-LD), which search engines use
// for rich results such as product prices, availability and breadcrumbs.

type JsonLd = Record<string, unknown>;

/**
 * Serializes JSON-LD for a <script> tag. `<` is escaped so text such as
 * "</script>" in a product description can't close the tag early.
 */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productJsonLd(product: Product, url: string): JsonLd {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const onlyVariant =
    product.variants.length === 1 ? product.variants[0] : null;
  const images = product.images.length
    ? product.images.map((image) => image.url)
    : product.featuredImage?.url
      ? [product.featuredImage.url]
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url,
    ...(images.length ? { image: images } : {}),
    ...(product.vendor
      ? { brand: { "@type": "Brand", name: product.vendor } }
      : {}),
    ...(onlyVariant?.sku ? { sku: onlyVariant.sku } : {}),
    offers: {
      "@type": "AggregateOffer",
      url,
      priceCurrency: minVariantPrice.currencyCode,
      lowPrice: minVariantPrice.amount,
      highPrice: maxVariantPrice.amount,
      offerCount: Math.max(product.variants.length, 1),
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd(
  name: string,
  url: string,
  logo?: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo ? { logo } : {}),
  };
}

export function websiteJsonLd(name: string, url: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  };
}
