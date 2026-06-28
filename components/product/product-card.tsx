import Image from "next/image";
import Link from "next/link";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { getLocalizedPath } from "lib/i18n";
import { createTranslator } from "lib/i18n";

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = createTranslator(locale);
  const { title, handle, availableForSale, priceRange, featuredImage } = product;
  const isSoldOut = !availableForSale;

  const productPath = getLocalizedPath(`/product/${handle}`, locale);

  return (
    <Link
      href={productPath}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            No Image
          </div>
        )}

        {isSoldOut && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-xs dark:bg-neutral-100 dark:text-neutral-900">
            {t("product.sold_out")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-900 line-clamp-2 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <Price
            amount={priceRange.minVariantPrice.amount}
            currencyCode={priceRange.minVariantPrice.currencyCode}
            className="text-base font-semibold text-neutral-900 dark:text-neutral-50"
          />
        </div>
      </div>
    </Link>
  );
}
