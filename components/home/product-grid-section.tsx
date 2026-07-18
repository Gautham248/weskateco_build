import ProductCard from "components/product/product-card";
import { Product } from "lib/shopify/types";
import Link from "next/link";

interface ProductGridSectionProps {
  title: string;
  products: Product[];
  locale: string;
  browseAllLink?: string;
  browseAllLabel?: string;
}

export default function ProductGridSection({
  title,
  products,
  locale,
  browseAllLink,
  browseAllLabel,
}: ProductGridSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-6 py-12 md:py-16">
      <div className="mb-8 flex items-baseline justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <h2 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        {browseAllLink && browseAllLabel && (
          <Link
            href={browseAllLink}
            className="text-sm font-semibold text-neutral-500 hover:text-black underline-offset-4 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {browseAllLabel} &rarr;
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.handle} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
