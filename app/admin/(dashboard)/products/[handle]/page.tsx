import { ProductOverrideForm } from "components/admin/product-override-form";
import { getOverrideByHandle } from "lib/admin/queries";
import { getRawProduct } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  return {
    title: `Edit ${handle} | WeSkate Admin`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const product = await getRawProduct(handle);

  if (!product) {
    notFound();
  }

  let existingOverride = null;
  let overrideLookupFailed = false;

  try {
    const record = await getOverrideByHandle(handle);

    if (record) {
      existingOverride = {
        title: record.title,
        descriptionHtml: record.descriptionHtml,
        galleryMode: record.galleryMode,
        coverImageUrl: record.coverImageUrl,
        removedImageUrls: record.removedImageUrls ?? [],
        images: record.images.map((image) => ({
          url: image.url,
          altText: image.altText,
          imagekitFileId: image.imagekitFileId,
          width: image.width,
          height: image.height,
        })),
      };
    }
  } catch (error) {
    console.error(`Could not load the override for "${handle}":`, error);
    overrideLookupFailed = true;
  }

  return (
    <div className="space-y-6">
      {overrideLookupFailed ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not read the saved override for this product. Saving will
          overwrite whatever is in the database.
        </p>
      ) : null}

      <ProductOverrideForm
        handle={product.handle}
        shopifyProductId={product.id}
        shopifyTitle={product.title}
        shopifyDescriptionHtml={product.descriptionHtml}
        shopifyImages={product.images.map((image) => ({
          url: image.url,
          altText: image.altText,
        }))}
        existingOverride={existingOverride}
      />
    </div>
  );
}
