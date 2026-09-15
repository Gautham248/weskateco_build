"use client";

import clsx from "clsx";
import {
  ImageManager,
  type ShopifyImage,
  type UploadedImage,
} from "components/admin/image-manager";
import { RichTextEditor } from "components/admin/rich-text-editor";
import {
  deleteProductOverrideAction,
  saveProductOverrideAction,
} from "lib/admin/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export type ExistingOverride = {
  title: string | null;
  descriptionHtml: string | null;
  galleryMode: string;
  coverImageUrl: string | null;
  removedImageUrls: string[];
  images: {
    url: string;
    altText: string | null;
    imagekitFileId: string | null;
    width: number | null;
    height: number | null;
  }[];
};

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const labelClasses =
  "mb-2 block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400";

function toUploaded(images: ExistingOverride["images"]): UploadedImage[] {
  return images.map((image, index) => ({
    key: `${image.url}_${index}`,
    url: image.url,
    altText: image.altText ?? "",
    imagekitFileId: image.imagekitFileId,
    width: image.width,
    height: image.height,
  }));
}

export function ProductOverrideForm({
  handle,
  shopifyProductId,
  shopifyTitle,
  shopifyDescriptionHtml,
  shopifyImages,
  existingOverride,
}: {
  handle: string;
  shopifyProductId: string;
  shopifyTitle: string;
  shopifyDescriptionHtml: string;
  shopifyImages: ShopifyImage[];
  existingOverride: ExistingOverride | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(existingOverride?.title ?? "");
  const [descriptionHtml, setDescriptionHtml] = useState(
    existingOverride?.descriptionHtml ?? shopifyDescriptionHtml,
  );
  const [galleryMode, setGalleryMode] = useState<"append" | "replace">(
    existingOverride?.galleryMode === "replace" ? "replace" : "append",
  );
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>(
    existingOverride?.removedImageUrls ?? [],
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    existingOverride?.coverImageUrl ?? null,
  );
  const [uploaded, setUploaded] = useState<UploadedImage[]>(
    toUploaded(existingOverride?.images ?? []),
  );

  const removed = new Set(removedImageUrls);
  const visibleShopifyImages =
    galleryMode === "replace"
      ? []
      : shopifyImages.filter((image) => !removed.has(image.url));
  const effectiveGallery = [
    ...visibleShopifyImages.map((image) => image.url),
    ...uploaded.map((image) => image.url),
  ];

  function handleSave() {
    startTransition(async () => {
      const result = await saveProductOverrideAction({
        productHandle: handle,
        shopifyProductId,
        // Store null when the value still matches Shopify so the product keeps
        // following Shopify for that field instead of being frozen.
        title: title.trim() === "" || title === shopifyTitle ? null : title,
        descriptionHtml:
          descriptionHtml === shopifyDescriptionHtml ? null : descriptionHtml,
        galleryMode,
        coverImageUrl,
        removedImageUrls,
        images: uploaded.map((image) => ({
          url: image.url,
          altText: image.altText || null,
          imagekitFileId: image.imagekitFileId,
          width: image.width,
          height: image.height,
        })),
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result?.success ?? "Saved.");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductOverrideAction(handle);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setTitle("");
      setDescriptionHtml(shopifyDescriptionHtml);
      setGalleryMode("append");
      setRemovedImageUrls([]);
      setCoverImageUrl(null);
      setUploaded([]);

      toast.success(result?.success ?? "Override removed.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-neutral-500 underline underline-offset-4 dark:text-neutral-400"
          >
            ← All products
          </Link>
          <h1 className="font-clash mt-2 text-xl font-bold tracking-widest uppercase">
            {shopifyTitle}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {handle}
          </p>
        </div>

        <Link
          href={`/product/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-neutral-300 px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          View on site
        </Link>
      </div>

      <section className="space-y-2">
        <label htmlFor="override-title" className={labelClasses}>
          Title
        </label>
        <input
          id="override-title"
          type="text"
          value={title}
          placeholder={shopifyTitle}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClasses}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Leave blank to keep the Shopify title.
        </p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className={labelClasses + " mb-0"}>Description</span>
          <button
            type="button"
            onClick={() => setDescriptionHtml(shopifyDescriptionHtml)}
            className="cursor-pointer text-xs underline underline-offset-4"
          >
            Reset to Shopify
          </button>
        </div>
        <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
      </section>

      <section className="space-y-3">
        <span className={labelClasses}>Gallery behaviour</span>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "append", label: "Keep Shopify photos + add mine" },
              { value: "replace", label: "Use only my photos" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGalleryMode(option.value)}
              className={clsx(
                "cursor-pointer rounded-[8px] border px-3 py-1.5 text-sm font-medium transition-all",
                galleryMode === option.value
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900/35 dark:text-neutral-200 dark:hover:bg-neutral-800",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {galleryMode === "replace" && shopifyImages.length > 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Shopify&apos;s {shopifyImages.length} photo
            {shopifyImages.length === 1 ? "" : "s"} will be hidden on the site.
            Shopify itself is unchanged.
          </p>
        ) : null}
      </section>

      <section>
        <span className={labelClasses}>Photos</span>
        <ImageManager
          shopifyImages={shopifyImages}
          removedImageUrls={removedImageUrls}
          onRemovedChange={setRemovedImageUrls}
          uploaded={uploaded}
          onUploadedChange={setUploaded}
          coverImageUrl={coverImageUrl}
          onCoverChange={setCoverImageUrl}
        />
      </section>

      <section>
        <span className={labelClasses}>
          Storefront gallery preview ({effectiveGallery.length})
        </span>
        {effectiveGallery.length > 0 ? (
          <ol className="flex flex-wrap gap-3">
            {effectiveGallery.map((url, index) => (
              <li
                key={`${url}_${index}`}
                className="relative rounded-sm border border-neutral-200 p-1 dark:border-neutral-800"
              >
                <img
                  src={url}
                  alt={`Gallery position ${index + 1}`}
                  className="h-20 w-20 rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                />
                <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
                  {index + 1}
                </span>
                {coverImageUrl === url ? (
                  <span className="absolute right-1 bottom-1 rounded-sm bg-black px-1 text-[9px] font-bold tracking-wider text-white uppercase dark:bg-white dark:text-black">
                    Cover
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            No photos. The product will show the Shopify featured image.
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="cursor-pointer rounded-sm border border-black bg-black px-6 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100"
        >
          {isPending ? "Saving…" : "Save override"}
        </button>

        {existingOverride ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer rounded-sm border border-red-300 px-6 py-3 text-xs font-bold tracking-wider text-red-600 uppercase transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Remove override
          </button>
        ) : null}
      </div>
    </div>
  );
}
