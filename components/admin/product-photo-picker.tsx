"use client";

import clsx from "clsx";
import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import { useRef, useState } from "react";
import { toast } from "sonner";

export type PhotoOption = {
  url: string;
  altText: string;
};

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/avif,image/gif";

/** Selected tiles get a ring and a check badge so the choice is unmissable. */
const SELECTED_TILE =
  "border-black ring-2 ring-black ring-offset-1 ring-offset-white dark:border-white dark:ring-white dark:ring-offset-neutral-950";

const UNSELECTED_TILE =
  "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600";

function SelectedCheck() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white shadow-sm dark:bg-white dark:text-black"
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

/**
 * Single-slot chooser. Pick one of the product's own photos, upload a new one,
 * or clear the choice to fall back to the product default.
 */
export function ProductPhotoPicker({
  label,
  photos,
  value,
  fallbackLabel,
  isLoading = false,
  onChange,
}: {
  label: string;
  photos: PhotoOption[];
  value: string | null;
  fallbackLabel: string;
  isLoading?: boolean;
  onChange: (url: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // An uploaded photo is not among the product's own images, so it needs its own
  // preview - otherwise the selection would look empty after uploading.
  const isUploaded = value !== null && !photos.some((p) => p.url === value);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/admin/api/upload", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        toast.error(payload.error ?? "Could not upload that photo.");
        return;
      }

      onChange(payload.url);
      toast.success("Photo uploaded and selected.");
    } catch (error) {
      console.error("Photo upload failed:", error);
      toast.error("Could not upload that photo.");
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400">
          {label}
        </span>
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={clsx(
            "inline-flex cursor-pointer items-center gap-1 rounded-[6px] border px-2 py-1 text-[10px] font-semibold transition-colors",
            value === null
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
          )}
        >
          {value === null ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
          {fallbackLabel}
        </button>
      </div>

      {isUploaded ? (
        <div className="flex items-center gap-2">
          <span
            className={clsx("relative rounded-sm border p-0.5", SELECTED_TILE)}
          >
            <img
              src={value}
              alt="Uploaded photo"
              className="h-16 w-16 rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
            />
            <SelectedCheck />
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            Uploaded
          </span>
        </div>
      ) : null}

      {photos.length > 0 ? (
        <ul className="flex gap-2.5 overflow-x-auto px-1 py-1">
          {photos.map((photo, index) => {
            const isSelected = value === photo.url;

            return (
              <li key={`${photo.url}-${index}`} className="flex-none">
                <button
                  type="button"
                  onClick={() => onChange(photo.url)}
                  aria-pressed={isSelected}
                  aria-label={
                    isSelected
                      ? `${label}: selected — ${photo.altText}`
                      : `${label}: select ${photo.altText}`
                  }
                  title={photo.altText}
                  className={clsx(
                    "relative block cursor-pointer rounded-sm border p-0.5 transition-all",
                    isSelected ? SELECTED_TILE : UNSELECTED_TILE,
                  )}
                >
                  <img
                    src={shopifyImageUrl(photo.url, SHOPIFY_IMAGE_WIDTH.thumb)}
                    alt={photo.altText || `Photo ${index + 1}`}
                    className="h-16 w-16 rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                  />
                  {isSelected ? <SelectedCheck /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {isLoading ? "Loading photos…" : "No photos found for this product."}
        </p>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-300 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase transition-colors hover:bg-neutral-100 has-disabled:cursor-not-allowed has-disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-900">
        {isUploading ? "Uploading…" : "Upload photo"}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          disabled={isUploading}
          onChange={(event) => void handleFile(event.target.files)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
