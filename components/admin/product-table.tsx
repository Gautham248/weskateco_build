import clsx from "clsx";
import type { ProductOverrideWithImages } from "lib/admin/queries";
import Price from "components/price";
import type { ShopifyProductSummary } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export function ProductTable({
  products,
  overridesByHandle,
}: {
  products: ShopifyProductSummary[];
  overridesByHandle: Map<string, ProductOverrideWithImages>;
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-left dark:border-neutral-800 dark:bg-neutral-900">
            <th className="px-4 py-3 font-semibold tracking-wider uppercase">
              Product
            </th>
            <th className="px-4 py-3 font-semibold tracking-wider uppercase">
              Vendor
            </th>
            <th className="px-4 py-3 font-semibold tracking-wider uppercase">
              Price
            </th>
            <th className="px-4 py-3 font-semibold tracking-wider uppercase">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const override = overridesByHandle.get(product.handle);
            const title = override?.title ?? product.title;
            const image = product.featuredImage;

            return (
              <tr
                key={product.handle}
                className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.altText || title}
                        width={image.width || 48}
                        height={image.height || 48}
                        className="h-12 w-12 shrink-0 rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                      />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-sm bg-neutral-100 dark:bg-neutral-900" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{title}</p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {product.handle}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  {product.vendor || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Price
                    amount={product.priceRange.minVariantPrice.amount}
                    currencyCode={
                      product.priceRange.minVariantPrice.currencyCode
                    }
                    currencyCodeClassName="hidden"
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "inline-block rounded-[6px] px-2 py-1 text-xs font-semibold",
                      override
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",
                    )}
                  >
                    {override ? "Overridden" : "Shopify"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.handle}`}
                    className="font-semibold underline underline-offset-4"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
