"use client";

import clsx from "clsx";
import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import { useRef, useState } from "react";
import { toast } from "sonner";

export type UploadedImage = {
  /** Stable key for React; not persisted. */
  key: string;
  url: string;
  altText: string;
  imagekitFileId: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyImage = {
  url: string;
  altText: string;
};

function newKey(): string {
  return `img_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function ImageManager({
  shopifyImages,
  removedImageUrls,
  onRemovedChange,
  uploaded,
  onUploadedChange,
  coverImageUrl,
  onCoverChange,
}: {
  shopifyImages: ShopifyImage[];
  removedImageUrls: string[];
  onRemovedChange: (urls: string[]) => void;
  uploaded: UploadedImage[];
  onUploadedChange: (images: UploadedImage[]) => void;
  coverImageUrl: string | null;
  onCoverChange: (url: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const removed = new Set(removedImageUrls);

  function toggleShopifyImage(url: string) {
    if (removed.has(url)) {
      onRemovedChange(removedImageUrls.filter((item) => item !== url));
    } else {
      onRemovedChange([...removedImageUrls, url]);
      if (coverImageUrl === url) {
        onCoverChange(null);
      }
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= uploaded.length) {
      return;
    }

    const next = [...uploaded];
    const current = next[index];
    const swap = next[target];

    if (!current || !swap) {
      return;
    }

    next[index] = swap;
    next[target] = current;
    onUploadedChange(next);
  }

  function removeUploaded(key: string) {
    const target = uploaded.find((image) => image.key === key);

    if (target && coverImageUrl === target.url) {
      onCoverChange(null);
    }

    onUploadedChange(uploaded.filter((image) => image.key !== key));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    const added: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);

      try {
        const response = await fetch("/admin/api/upload", {
          method: "POST",
          body,
        });

        const payload = (await response.json()) as {
          url?: string;
          fileId?: string;
          width?: number | null;
          height?: number | null;
          error?: string;
        };

        if (!response.ok || !payload.url) {
          toast.error(payload.error ?? `Could not upload ${file.name}.`);
          continue;
        }

        added.push({
          key: newKey(),
          url: payload.url,
          altText: "",
          imagekitFileId: payload.fileId ?? null,
          width: payload.width ?? null,
          height: payload.height ?? null,
        });
      } catch {
        toast.error(`Could not upload ${file.name}.`);
      }
    }

    if (added.length > 0) {
      onUploadedChange([...uploaded, ...added]);
      toast.success(
        added.length === 1
          ? "Photo uploaded."
          : `${added.length} photos uploaded.`,
      );
    }

    setIsUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400">
          Add photos
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          disabled={isUploading}
          onChange={(event) => void handleFiles(event.target.files)}
          className="block w-full cursor-pointer rounded-sm border border-dashed border-neutral-400 px-3 py-4 text-sm file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:font-bold file:tracking-wider file:text-white file:uppercase dark:border-neutral-600 dark:file:bg-white dark:file:text-black"
        />
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {isUploading
            ? "Uploading…"
            : "JPEG, PNG, WebP, AVIF or GIF, up to 10MB each."}
        </p>
      </div>

      {uploaded.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400">
            Added photos ({uploaded.length})
          </p>
          <ul className="space-y-3">
            {uploaded.map((image, index) => (
              <li
                key={image.key}
                className="flex gap-3 rounded-sm border border-neutral-200 p-3 dark:border-neutral-800"
              >
                <img
                  src={image.url}
                  alt={image.altText || "Added product photo"}
                  className="h-20 w-20 shrink-0 rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    value={image.altText}
                    placeholder="Alt text"
                    onChange={(event) =>
                      onUploadedChange(
                        uploaded.map((item) =>
                          item.key === image.key
                            ? { ...item, altText: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="w-full rounded-sm border border-neutral-300 px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="cursor-pointer rounded-sm border border-neutral-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === uploaded.length - 1}
                      className="cursor-pointer rounded-sm border border-neutral-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onCoverChange(
                          coverImageUrl === image.url ? null : image.url,
                        )
                      }
                      className={clsx(
                        "cursor-pointer rounded-sm border px-2 py-1 text-xs font-semibold",
                        coverImageUrl === image.url
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-neutral-300 dark:border-neutral-700",
                      )}
                    >
                      {coverImageUrl === image.url ? "Cover ✓" : "Set as cover"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUploaded(image.key)}
                      className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs text-red-600 dark:border-red-900 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {shopifyImages.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400">
            Shopify photos
          </p>
          <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
            Untick to hide a photo on the site. Shopify itself is never
            modified.
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {shopifyImages.map((image) => {
              const isHidden = removed.has(image.url);
              const isCover = coverImageUrl === image.url;

              return (
                <li
                  key={image.url}
                  className={clsx(
                    "rounded-sm border p-2",
                    isHidden
                      ? "border-neutral-200 opacity-50 dark:border-neutral-800"
                      : "border-neutral-300 dark:border-neutral-700",
                  )}
                >
                  <img
                    src={shopifyImageUrl(image.url, SHOPIFY_IMAGE_WIDTH.thumb)}
                    alt={image.altText || "Shopify photo"}
                    className="h-24 w-full rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        onChange={() => toggleShopifyImage(image.url)}
                      />
                      Show
                    </label>
                    <button
                      type="button"
                      onClick={() => onCoverChange(isCover ? null : image.url)}
                      className={clsx(
                        "cursor-pointer rounded-sm border px-2 py-1 text-[10px] font-semibold",
                        isCover
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-neutral-300 dark:border-neutral-700",
                      )}
                    >
                      {isCover ? "Cover ✓" : "Cover"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
