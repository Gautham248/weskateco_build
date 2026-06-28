import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";
import ProductCard from "components/product/product-card";
import ProductTabs from "components/product/product-tabs";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createTranslator, getLocalizedPath } from "lib/i18n";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  const t = createTranslator(params.locale);
  const firstCollection = product.collections?.edges?.[0]?.node;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Link
            href={getLocalizedPath("/", params.locale)}
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            {t("nav.home")}
          </Link>
          {firstCollection && (
            <>
              <span className="text-neutral-400 dark:text-neutral-600">/</span>
              <Link
                href={getLocalizedPath(`/search/${firstCollection.handle}`, params.locale)}
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                {firstCollection.title}
              </Link>
            </>
          )}
          <span className="text-neutral-400 dark:text-neutral-600">/</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
            {product.title}
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} locale={params.locale} />
            </Suspense>
          </div>
        </div>

        {/* Product Information Tabs */}
        <ProductTabs
          descriptionHtml={product.descriptionHtml}
          description={product.description}
          metafields={product.metafields || []}
        />

        {/* Related Products */}
        <RelatedProducts id={product.id} locale={params.locale} />
      </div>
      <Footer />
    </>
  );
}

async function RelatedProducts({ id, locale }: { id: string; locale: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  const t = createTranslator(locale);

  return (
    <div className="mt-16 border-t border-neutral-200 py-12 dark:border-neutral-800">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {t("product.related_products")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.handle} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
