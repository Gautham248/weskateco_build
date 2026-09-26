import CategoryGrid from "components/home/category-grid";
import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import ProductCard from "components/product/product-card";
import { ProductDescription } from "components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { productReadState } from "lib/catalog/product-page";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import { getProductRecommendations, readProductForPage } from "lib/shopify";
import type { Image, Product } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const state = productReadState(await readProductForPage(params.handle));

  if (state.kind === "missing") return notFound();

  // A transient failure is not this product's content, so it must not be indexed in the
  // product page's place. Losing a ranking is recoverable; having a crawler cache this
  // render as the real page is not.
  if (state.kind === "unavailable") {
    return {
      title: createTranslator(params.locale)("product.unavailable_title"),
      robots: { index: false, follow: false },
    };
  }

  const product = state.product;
  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
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
  const state = productReadState(await readProductForPage(params.handle));

  if (state.kind === "missing") return notFound();

  if (state.kind === "unavailable") {
    return <ProductUnavailable locale={params.locale} handle={params.handle} />;
  }

  const product = state.product;

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
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 py-4">
        {/* Breadcrumb */}
        {/* <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
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
                href={getLocalizedPath(`/store/${firstCollection.handle}`, params.locale)}
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
        </div> */}

        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 py-6 md:py-8">
          <div className="-mx-4 w-[calc(100%+32px)] lg:mx-0 lg:w-full basis-full lg:basis-7/12 lg:sticky lg:top-24 mb-5 lg:mb-0">
            <Suspense
              fallback={
                <div className="relative aspect-[581/897] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900" />
              }
            >
              <Gallery
                images={product.images.slice(0, 6).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="min-w-0 basis-full lg:basis-5/12">
            <Suspense fallback={null}>
              <ProductDescription product={product} locale={params.locale} />
            </Suspense>
          </div>
        </div>
        {/* Related Products */}
        <RelatedProducts id={product.id} locale={params.locale} />
      </div>
      <CategoryGrid locale={params.locale} />
      <Footer />
    </>
  );
}

async function RelatedProducts({ id, locale }: { id: string; locale: string }) {
  let relatedProducts: Product[] = [];

  try {
    relatedProducts = await getProductRecommendations(id);
  } catch (error) {
    // A secondary section must never take the page down with it — the product itself is
    // the content, and it has already rendered by this point.
    console.error(
      "Could not read related products from Shopify; hiding that section:",
      error,
    );

    return null;
  }

  if (!relatedProducts.length) return null;

  const t = createTranslator(locale);

  return (
    <div className="mt-16 border-t border-neutral-200 py-12 dark:border-neutral-800">
      <h2
        className="mb-8 text-4xl font-black tracking-tight text-black dark:text-white sm:text-5xl lg:text-[60px]"
        style={{
          fontFamily: "'Clash Display', sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        {t("product.related_products").toUpperCase()}
      </h2>
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-11 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-2.5 md:gap-y-20">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.handle} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}

/**
 * Shown when Shopify could not be asked about this product.
 *
 * Deliberately its own page rather than a 404 or a thrown error: the product very likely
 * exists, and telling a customer — or a crawler — otherwise is the one outcome worth
 * avoiding. It keeps the footer so navigation still works, and offers a retry that is
 * just a link back to this URL, so recovery needs no client-side state.
 */
function ProductUnavailable({
  locale,
  handle,
}: {
  locale: string;
  handle: string;
}) {
  const t = createTranslator(locale);

  return (
    <>
      <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-15">
        <h1
          className="text-2xl font-bold tracking-tight text-black sm:text-3xl dark:text-white"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {t("product.unavailable_title")}
        </h1>
        <p className="mt-4 text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
          {t("product.unavailable_message")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={getLocalizedPath(`/products/${handle}`, locale)}
            className="rounded-full border border-black px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            {t("product.unavailable_retry")}
          </Link>
          <Link
            href={getLocalizedPath("/store", locale)}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {t("home.browse_all")}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
