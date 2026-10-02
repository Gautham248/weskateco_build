"use client";

import { ConfirmDialog } from "components/admin/confirm-dialog";
import { saveSocialPostsAction } from "lib/admin/actions";
import {
  imageLooksLikePostLink,
  isAllowedPermalink,
  isAllowedPostImageUrl,
  MAX_SOCIAL_POSTS,
  newSocialPostId,
  normalizePlatform,
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type SocialPlatform,
} from "lib/catalog/social-posts";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type SocialPostManagerItem = {
  id: string;
  imageUrl: string;
  altText: string;
  permalink: string;
  platform: string;
  isReel: boolean;
};

/**
 * Debounce on typed fields. An upload or a reorder saves immediately instead,
 * since neither is keystroke-driven.
 */
const EDIT_DEBOUNCE_MS = 600;

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const labelClasses =
  "mb-2 block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400";

const moverClasses =
  "cursor-pointer rounded-sm border border-neutral-300 px-2 py-1 text-xs transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900";

const smallButtonClasses =
  "cursor-pointer rounded-sm border border-neutral-300 px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900";

/** Platforms that have a "reel" as a named format. */
const REEL_PLATFORMS: ReadonlySet<SocialPlatform> = new Set([
  "instagram",
  "tiktok",
]);

type Payload = {
  items: {
    id: string;
    imageUrl: string;
    altText: string | null;
    permalink: string | null;
    platform: string;
    isReel: boolean;
  }[];
};

function buildPayload(items: SocialPostManagerItem[]): Payload {
  return {
    items: items.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl.trim(),
      altText: item.altText.trim() ? item.altText.trim() : null,
      permalink: item.permalink.trim() ? item.permalink.trim() : null,
      platform: item.platform,
      isReel: item.isReel,
    })),
  };
}

export function SocialPostsManager({
  initialItems,
}: {
  initialItems: SocialPostManagerItem[];
}) {
  const [items, setItems] = useState<SocialPostManagerItem[]>(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<{
    index: number;
    label: string;
  } | null>(null);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const pendingSaveRef = useRef<Payload | null>(null);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  async function runSave(body: Payload) {
    if (inFlightRef.current) {
      pendingSaveRef.current = body;
      return;
    }

    inFlightRef.current = true;
    let current: Payload | null = body;
    let failed = false;

    while (current) {
      try {
        const result = await saveSocialPostsAction(current);

        if (result?.error) {
          setError(result.error);
          failed = true;
        } else {
          setError(null);
          setWarnings(result?.warnings ?? []);
        }
      } catch (saveError) {
        console.error("Saving the social posts failed:", saveError);
        setError("Could not save. Check your connection and try again.");
        failed = true;
      }

      current = pendingSaveRef.current;
      pendingSaveRef.current = null;
    }

    inFlightRef.current = false;
    setSaveState(failed ? "idle" : "saved");
  }

  function persist(next: SocialPostManagerItem[], delayMs = 0) {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Same policy as the rest of the admin panel: an entry missing its image
    // blocks the save rather than writing a row that cannot render.
    const incomplete = next.filter(
      (item) => !isAllowedPostImageUrl(item.imageUrl.trim()),
    );

    if (incomplete.length > 0) {
      setSaveState("idle");
      setNotice(
        incomplete.length === 1
          ? "Upload an image for every post before changes can be saved."
          : `Upload an image for all ${incomplete.length} posts before changes can be saved.`,
      );
      return;
    }

    setNotice(null);
    setSaveState("saving");

    const body = buildPayload(next);

    saveTimerRef.current = setTimeout(() => {
      void runSave(body);
    }, delayMs);
  }

  function update(index: number, patch: Partial<SocialPostManagerItem>) {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );

    setItems(next);
    // Typing in a text field is debounced; a checkbox toggle saves at once.
    const isTyping =
      patch.imageUrl !== undefined ||
      patch.permalink !== undefined ||
      patch.altText !== undefined;
    persist(next, isTyping ? EDIT_DEBOUNCE_MS : 0);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    const current = items[index];
    const swap = items[target];

    if (!current || !swap) {
      return;
    }

    const next = [...items];
    next[index] = swap;
    next[target] = current;

    setItems(next);
    persist(next);
  }

  function addEmpty() {
    if (items.length >= MAX_SOCIAL_POSTS) {
      toast.error(`The strip holds at most ${MAX_SOCIAL_POSTS} posts.`);
      return;
    }

    setItems([
      ...items,
      {
        id: newSocialPostId(),
        imageUrl: "",
        altText: "",
        permalink: "",
        platform: "instagram",
        isReel: false,
      },
    ]);
    // Deliberately no save: the new row has no image yet, and persist() would
    // refuse the whole list. It is written once an image is uploaded.
    setNotice("Upload an image for the new post to save it.");
  }

  function remove(index: number) {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    setPendingRemoval(null);
    persist(next);
  }

  async function handleUpload(index: number, file: File) {
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "/weskateco/social");

      const response = await fetch("/admin/api/upload", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        toast.error(payload.error ?? `Could not upload ${file.name}.`);
        return;
      }

      // Now the row is complete, so persist it rather than waiting for a
      // keystroke that will never come.
      const next = items.map((item, i) =>
        i === index ? { ...item, imageUrl: payload.url! } : item,
      );

      setItems(next);
      persist(next);
      toast.success("Image uploaded.");
    } catch {
      toast.error(`Could not upload ${file.name}.`);
    } finally {
      setIsUploading(false);
    }
  }

  const pendingRemovalItem =
    pendingRemoval === null ? undefined : items[pendingRemoval.index];

  return (
    <div className="space-y-10">
      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => persist(itemsRef.current)}
            className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs font-bold tracking-wider uppercase dark:border-red-800"
          >
            Retry save
          </button>
        </div>
      ) : null}

      {warnings.map((warning) => (
        <p
          key={warning}
          className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {warning}
        </p>
      ))}

      {notice ? (
        <p
          role="status"
          className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300"
        >
          {notice}
        </p>
      ) : null}

      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {items.length === 0
          ? "No posts yet, so the storefront section is hidden. Add one to bring it back."
          : `${items.length} of ${MAX_SOCIAL_POSTS} posts. They appear in this order on the home page and every store page.`}
      </p>

      {items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          Nothing to show yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => {
            const permalinkProblem =
              item.permalink.trim() !== "" &&
              !isAllowedPermalink(item.permalink.trim());

            /**
             * The exact mistake that 500'd the storefront once: a post's own
             * URL pasted into the image field. It saves fine and renders a
             * broken card, so it is called out here rather than blocked — some
             * hosts genuinely do serve an image from the post URL.
             */
            const imageIsPostLink = imageLooksLikePostLink(
              item.imageUrl,
              item.permalink,
            );

            return (
              <li
                key={item.id}
                className="rounded-sm border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-start gap-4">
                  {/* Preview */}
                  <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                    {isAllowedPostImageUrl(item.imageUrl.trim()) ? (
                      // Admin previews bypass the optimiser: these are arbitrary
                      // user-entered hosts, and next/image would throw on any
                      // that are not in next.config.ts remotePatterns.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl.trim()}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-center text-[10px] text-neutral-500 dark:text-neutral-400">
                        No image
                      </span>
                    )}
                  </div>

                  {imageIsPostLink ? (
                    <p className="w-full rounded-sm border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      This is the same URL as the link field — a post&apos;s web
                      address is not an image, so this card will render as
                      &quot;Image unavailable&quot;. Use the Upload button for
                      the picture, and keep the address in the link field.
                    </p>
                  ) : null}

                  {/* Fields */}
                  <div className="min-w-[260px] flex-1 space-y-3">
                    <div>
                      <label
                        className={labelClasses}
                        htmlFor={`image-${item.id}`}
                      >
                        Image
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <input
                          id={`image-${item.id}`}
                          type="text"
                          value={item.imageUrl}
                          onChange={(event) =>
                            update(index, { imageUrl: event.target.value })
                          }
                          placeholder="https://… or /path/on/this/site.png"
                          className={`${inputClasses} flex-1`}
                        />
                        <label className={smallButtonClasses}>
                          {isUploading ? "Uploading…" : "Upload"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                            className="sr-only"
                            disabled={isUploading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                void handleUpload(index, file);
                              }
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        className={labelClasses}
                        htmlFor={`permalink-${item.id}`}
                      >
                        Instagram link
                      </label>
                      <input
                        id={`permalink-${item.id}`}
                        type="url"
                        value={item.permalink}
                        onChange={(event) =>
                          update(index, { permalink: event.target.value })
                        }
                        placeholder="https://www.instagram.com/p/…"
                        aria-invalid={permalinkProblem || undefined}
                        aria-describedby={
                          permalinkProblem
                            ? `permalink-help-${item.id}`
                            : undefined
                        }
                        className={`${inputClasses} ${
                          permalinkProblem
                            ? "border-red-400 dark:border-red-600"
                            : ""
                        }`}
                      />
                      {permalinkProblem ? (
                        <p
                          id={`permalink-help-${item.id}`}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                        >
                          Must be an https:// URL. Leave blank to publish the
                          image without a link.
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        className={labelClasses}
                        htmlFor={`alt-${item.id}`}
                      >
                        Alt text
                      </label>
                      <input
                        id={`alt-${item.id}`}
                        type="text"
                        value={item.altText}
                        onChange={(event) =>
                          update(index, { altText: event.target.value })
                        }
                        placeholder="Describes the image for screen readers"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label
                        className={labelClasses}
                        htmlFor={`platform-${item.id}`}
                      >
                        Platform
                      </label>
                      <select
                        id={`platform-${item.id}`}
                        value={item.platform}
                        onChange={(event) =>
                          update(index, { platform: event.target.value })
                        }
                        className={inputClasses}
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform} value={platform}>
                            {SOCIAL_PLATFORM_LABELS[platform]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reels only exist on Instagram and TikTok, so the toggle is
                        hidden elsewhere rather than offering a format the
                        platform has no word for. */}
                    {REEL_PLATFORMS.has(normalizePlatform(item.platform)) ? (
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.isReel}
                          onChange={(event) =>
                            update(index, { isReel: event.target.checked })
                          }
                          className="h-4 w-4"
                        />
                        This is a reel
                      </label>
                    ) : null}
                  </div>

                  {/* Ordering + removal */}
                  <div className="flex shrink-0 flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Move post earlier"
                        className={moverClasses}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label="Move post later"
                        className={moverClasses}
                      >
                        ↓
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingRemoval({
                          index,
                          label: item.altText.trim() || `Post ${index + 1}`,
                        })
                      }
                      className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs font-bold tracking-wider uppercase text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <button
          type="button"
          onClick={addEmpty}
          disabled={items.length >= MAX_SOCIAL_POSTS}
          className={smallButtonClasses}
        >
          Add post
        </button>

        <p
          role="status"
          aria-live="polite"
          className="text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
        >
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "Saved"
              : ""}
        </p>
      </div>

      <ConfirmDialog
        isOpen={pendingRemovalItem !== undefined}
        title="Remove this post?"
        description={
          pendingRemovalItem
            ? `"${pendingRemoval?.label}" will be removed from the storefront strip. This cannot be undone from here.`
            : undefined
        }
        confirmLabel="Remove"
        isDestructive
        onCancel={() => setPendingRemoval(null)}
        onConfirm={() => {
          if (pendingRemoval) {
            remove(pendingRemoval.index);
          }
        }}
      />
    </div>
  );
}
