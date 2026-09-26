"use client";

import { ConfirmDialog } from "components/admin/confirm-dialog";
import clsx from "clsx";
import { saveHeroAction } from "lib/admin/actions";
import {
  HERO_DEFAULT_SECONDS,
  HERO_MAX_SECONDS,
  HERO_MIN_SECONDS,
  isAllowedHeroUrl,
  newHeroItemId,
  type HeroItemKind,
} from "lib/catalog/hero";
import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type HeroManagerItem = {
  id: string;
  kind: HeroItemKind;
  url: string;
  altText: string;
  posterUrl: string;
  /** Kept as a string so the field can be empty, meaning "use the default". */
  seconds: string;
};

type HeroPayload = {
  items: {
    id: string;
    kind: HeroItemKind;
    url: string;
    altText: string | null;
    posterUrl: string | null;
    seconds: number | null;
  }[];
  defaultSeconds: number;
};

const EDIT_DEBOUNCE_MS = 600;

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const labelClasses =
  "mb-2 block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400";

const moverClasses =
  "cursor-pointer rounded-sm border border-neutral-300 px-2 py-1 text-xs transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900";

const smallButtonClasses =
  "cursor-pointer rounded-sm border border-neutral-300 px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900";

function parseSeconds(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function buildPayload(
  items: HeroManagerItem[],
  defaultSeconds: string,
): HeroPayload {
  return {
    items: items.map((item) => ({
      id: item.id,
      kind: item.kind,
      url: item.url.trim(),
      altText: item.altText.trim() || null,
      posterUrl: item.posterUrl.trim() || null,
      seconds: parseSeconds(item.seconds),
    })),
    defaultSeconds: parseSeconds(defaultSeconds) ?? HERO_DEFAULT_SECONDS,
  };
}

/** The debounced values the preview renders from, so typing a URL is not one request per keystroke. */
type HeroPreviewSource = {
  url: string;
  posterUrl: string;
};

const PREVIEW_TILE_CLASSES =
  "flex h-16 w-28 flex-none items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900";

const PREVIEW_LABEL_CLASSES =
  "px-1 text-center text-[10px] font-semibold tracking-wider uppercase";

/**
 * Shows what a slide will actually look like. object-cover rather than contain,
 * because the hero is full-bleed - the tile should show the crop the storefront
 * will produce, not the whole image letterboxed.
 */
function HeroPreview({
  kind,
  source,
}: {
  kind: HeroItemKind;
  source: HeroPreviewSource | undefined;
}) {
  const [failed, setFailed] = useState(false);

  const url = source && isAllowedHeroUrl(source.url) ? source.url : null;
  const poster =
    source && isAllowedHeroUrl(source.posterUrl) ? source.posterUrl : null;

  // A corrected URL is a fresh attempt, so an earlier failure must not stick.
  useEffect(() => {
    setFailed(false);
  }, [url, poster, kind]);

  if (!url) {
    return (
      <div className={PREVIEW_TILE_CLASSES}>
        <span
          className={clsx(
            PREVIEW_LABEL_CLASSES,
            "text-neutral-400 dark:text-neutral-500",
          )}
        >
          No preview
        </span>
      </div>
    );
  }

  // A dead link is worth seeing in the list rather than as a broken-image icon.
  if (failed) {
    return (
      <div className={PREVIEW_TILE_CLASSES}>
        <span
          className={clsx(
            PREVIEW_LABEL_CLASSES,
            "text-amber-700 dark:text-amber-400",
          )}
        >
          Preview unavailable
        </span>
      </div>
    );
  }

  if (kind === "video" && !poster) {
    return (
      <div className={PREVIEW_TILE_CLASSES}>
        <video
          key={url}
          src={url}
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            const target =
              Number.isFinite(video.duration) && video.duration > 0
                ? Math.min(0.1, video.duration / 2)
                : 0.1;

            try {
              // Left alone, a video element paints a black box; nudging it past
              // zero makes it render a real frame.
              video.currentTime = target;
            } catch {
              // Seeking can throw before the source is seekable, which just
              // leaves the first frame showing instead.
            }
          }}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={PREVIEW_TILE_CLASSES}>
      <img
        src={shopifyImageUrl(
          kind === "video" ? (poster as string) : url,
          SHOPIFY_IMAGE_WIDTH.hero,
        )}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/**
 * Every change persists on its own — adding, removing, reordering, editing.
 * There is deliberately no separate "Save" step, matching the other admin tabs.
 *
 * Saves are serialised rather than merely debounced. Clearing the debounce timer
 * stops a queue of pending saves but not two requests in flight at once, and with
 * a whole-state save the loser of that race would silently be whichever the
 * server happened to process last. Anything that changes mid-flight is held in
 * pendingSaveRef and sent as soon as the current save settles, so the last edit
 * always wins.
 */
export function HeroManager({
  initialItems,
  initialDefaultSeconds,
}: {
  initialItems: HeroManagerItem[];
  initialDefaultSeconds: number;
}) {
  const [items, setItems] = useState<HeroManagerItem[]>(initialItems);
  const [defaultSeconds, setDefaultSeconds] = useState(
    String(initialDefaultSeconds),
  );
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [previews, setPreviews] = useState<Record<string, HeroPreviewSource>>(
    () =>
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          { url: item.url.trim(), posterUrl: item.posterUrl.trim() },
        ]),
      ),
  );
  const [pendingRemoval, setPendingRemoval] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [isUploading, setIsUploading] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const pendingSaveRef = useRef<HeroPayload | null>(null);
  const itemsRef = useRef(items);
  const previewInitialisedRef = useRef(false);

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

  // The preview follows the debounced URL rather than the raw input, so pasting a
  // long link is one request instead of one per keystroke. Seeded from the initial
  // items above, so the first paint already shows the real media and the effect
  // has nothing to do until something actually changes.
  const previewKey = items
    .map(
      (item) =>
        `${item.id}:${item.kind}:${item.url.trim()}:${item.posterUrl.trim()}`,
    )
    .join("|");

  useEffect(() => {
    if (!previewInitialisedRef.current) {
      previewInitialisedRef.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setPreviews(
        Object.fromEntries(
          itemsRef.current.map((item) => [
            item.id,
            { url: item.url.trim(), posterUrl: item.posterUrl.trim() },
          ]),
        ),
      );
    }, EDIT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [previewKey]);

  // Only the set of video URLs matters, so this does not re-probe on every
  // keystroke in an unrelated field.
  const videoProbeKey = items
    .filter((item) => item.kind === "video")
    .map((item) => item.url.trim())
    .join("|");

  useEffect(() => {
    const targets = itemsRef.current.filter(
      (item) => item.kind === "video" && isAllowedHeroUrl(item.url.trim()),
    );
    const elements: HTMLVideoElement[] = [];

    for (const item of targets) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;

      const record = () => {
        if (Number.isFinite(video.duration)) {
          setDurations((previous) => ({
            ...previous,
            [item.id]: video.duration,
          }));
        }
      };

      video.addEventListener("loadedmetadata", record);
      video.src = item.url.trim();
      elements.push(video);
    }

    return () => {
      for (const video of elements) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [videoProbeKey]);

  async function runSave(body: HeroPayload) {
    if (inFlightRef.current) {
      pendingSaveRef.current = body;
      return;
    }

    inFlightRef.current = true;
    let current: HeroPayload | null = body;
    let failed = false;

    while (current) {
      try {
        const result = await saveHeroAction(current);

        if (result?.error) {
          setError(result.error);
          failed = true;
        } else {
          setError(null);
          setWarnings(result?.warnings ?? []);
        }
      } catch (saveError) {
        console.error("Saving the hero failed:", saveError);
        setError("Could not save. Check your connection and try again.");
        failed = true;
      }

      current = pendingSaveRef.current;
      pendingSaveRef.current = null;
    }

    inFlightRef.current = false;
    setSaveState(failed ? "idle" : "saved");
  }

  function persist(next: HeroManagerItem[], nextDefault: string, delayMs = 0) {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    const incomplete = next.filter(
      (item) => !isAllowedHeroUrl(item.url.trim()),
    );

    if (incomplete.length > 0) {
      setSaveState("idle");
      setNotice(
        incomplete.length === 1
          ? "Enter a URL for every slide before changes can be saved."
          : `Enter a URL for all ${incomplete.length} slides before changes can be saved.`,
      );
      return;
    }

    setNotice(null);
    setSaveState("saving");

    const body = buildPayload(next, nextDefault);

    saveTimerRef.current = setTimeout(() => {
      void runSave(body);
    }, delayMs);
  }

  function update(index: number, patch: Partial<HeroManagerItem>) {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );

    setItems(next);
    persist(
      next,
      defaultSeconds,
      patch.url === undefined ? 0 : EDIT_DEBOUNCE_MS,
    );
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
    persist(next, defaultSeconds);
  }

  function handleRemove(id: string) {
    const next = items.filter((item) => item.id !== id);

    setItems(next);
    persist(next, defaultSeconds);
  }

  function addItem(kind: HeroItemKind) {
    const next: HeroManagerItem[] = [
      ...items,
      {
        id: newHeroItemId(),
        kind,
        url: "",
        altText: "",
        posterUrl: "",
        seconds: "",
      },
    ];

    setItems(next);
    setNotice("Enter a URL for the new slide to save it.");
  }

  async function handleUpload(index: number, file: File) {
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
        toast.error(payload.error ?? `Could not upload ${file.name}.`);
        return;
      }

      update(index, { url: payload.url });
      toast.success("Image uploaded.");
    } catch {
      toast.error(`Could not upload ${file.name}.`);
    } finally {
      setIsUploading(false);
    }
  }

  const effectiveDefault = parseSeconds(defaultSeconds) ?? HERO_DEFAULT_SECONDS;
  const pendingRemovalItem = pendingRemoval
    ? items.find((item) => item.id === pendingRemoval.id)
    : undefined;

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
            onClick={() => persist(items, defaultSeconds)}
            className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs font-bold tracking-wider uppercase dark:border-red-800"
          >
            Retry save
          </button>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <ul
          role="status"
          className="space-y-1 rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <section className="max-w-md space-y-4">
        <div>
          <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
            Autoplay
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            How long a slide is shown when its own duration is left blank.
          </p>
        </div>

        <div>
          <label htmlFor="hero-default-seconds" className={labelClasses}>
            Default duration (seconds)
          </label>
          <input
            id="hero-default-seconds"
            type="number"
            min={HERO_MIN_SECONDS}
            max={HERO_MAX_SECONDS}
            value={defaultSeconds}
            onChange={(event) => setDefaultSeconds(event.target.value)}
            onBlur={() => persist(items, defaultSeconds)}
            className={inputClasses}
          />
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {HERO_MIN_SECONDS}–{HERO_MAX_SECONDS} seconds.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
              Slides
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {items.length === 0
                ? "No slides yet. The homepage is showing its fallback image."
                : `${items.length} slide${items.length === 1 ? "" : "s"} will rotate in this order.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => addItem("image")}
              className={smallButtonClasses}
            >
              Add an image
            </button>
            <button
              type="button"
              onClick={() => addItem("video")}
              className={smallButtonClasses}
            >
              Add a video
            </button>
            <span
              aria-live="polite"
              className={clsx(
                "text-xs",
                error
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {notice
                ? notice
                : saveState === "saving"
                  ? "Saving…"
                  : saveState === "saved"
                    ? "All changes saved"
                    : null}
            </span>
          </div>
        </div>

        {items.length === 0 ? null : (
          <ul className="space-y-4">
            {items.map((item, index) => {
              const duration = durations[item.id];
              const seconds = parseSeconds(item.seconds) ?? effectiveDefault;
              const isCutOff =
                item.kind === "video" &&
                duration !== undefined &&
                seconds < duration;

              return (
                <li
                  key={item.id}
                  className="space-y-5 rounded-sm border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-black text-[11px] font-bold text-white dark:bg-white dark:text-black">
                        {index + 1}
                      </span>

                      <HeroPreview
                        kind={item.kind}
                        source={previews[item.id]}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.kind === "video" ? "Video" : "Image"}
                        </p>
                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {item.url.trim() || "No URL yet"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Move up"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className={moverClasses}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        className={moverClasses}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingRemoval({
                            id: item.id,
                            label: item.url.trim() || "this slide",
                          })
                        }
                        className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs text-red-600 dark:border-red-900 dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`hero-kind-${item.id}`}
                        className={labelClasses}
                      >
                        Type
                      </label>
                      <select
                        id={`hero-kind-${item.id}`}
                        value={item.kind}
                        onChange={(event) =>
                          update(index, {
                            kind:
                              event.target.value === "video"
                                ? "video"
                                : "image",
                          })
                        }
                        className={inputClasses}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`hero-seconds-${item.id}`}
                        className={labelClasses}
                      >
                        Show for (seconds)
                      </label>
                      <input
                        id={`hero-seconds-${item.id}`}
                        type="number"
                        min={HERO_MIN_SECONDS}
                        max={HERO_MAX_SECONDS}
                        value={item.seconds}
                        placeholder={`Default (${effectiveDefault})`}
                        onChange={(event) =>
                          update(index, { seconds: event.target.value })
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`hero-url-${item.id}`}
                      className={labelClasses}
                    >
                      Media URL
                    </label>
                    <div className="flex flex-wrap items-start gap-3">
                      <input
                        id={`hero-url-${item.id}`}
                        type="text"
                        value={item.url}
                        placeholder={
                          item.kind === "video"
                            ? "https://…/clip.mp4"
                            : "https://…/photo.jpg or /hero/cover_vid.gif"
                        }
                        onChange={(event) =>
                          update(index, { url: event.target.value })
                        }
                        className={clsx(inputClasses, "min-w-0 flex-1")}
                      />

                      {item.kind === "image" ? (
                        <label
                          className={clsx(
                            smallButtonClasses,
                            isUploading && "cursor-not-allowed opacity-60",
                          )}
                        >
                          {isUploading ? "Uploading…" : "Upload"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                            disabled={isUploading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                void handleUpload(index, file);
                              }
                              event.target.value = "";
                            }}
                            className="sr-only"
                          />
                        </label>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      https:// links, or a path on this site such as
                      /hero/cover_vid.gif.
                    </p>
                  </div>

                  {item.kind === "video" ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`hero-poster-${item.id}`}
                          className={labelClasses}
                        >
                          Poster image (optional)
                        </label>
                        <input
                          id={`hero-poster-${item.id}`}
                          type="text"
                          value={item.posterUrl}
                          placeholder="https://…/still.jpg"
                          onChange={(event) =>
                            update(index, { posterUrl: event.target.value })
                          }
                          className={inputClasses}
                        />
                        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                          Shown while the video buffers, so the slide is never a
                          blank rectangle.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor={`hero-alt-${item.id}`}
                        className={labelClasses}
                      >
                        Alt text
                      </label>
                      <input
                        id={`hero-alt-${item.id}`}
                        type="text"
                        value={item.altText}
                        placeholder="Describe the image"
                        onChange={(event) =>
                          update(index, { altText: event.target.value })
                        }
                        className={inputClasses}
                      />
                    </div>
                  )}

                  {isCutOff ? (
                    <p
                      role="status"
                      className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                      This video runs about {Math.round(duration)}s but is set
                      to show for {seconds}s, so it will be cut off. Raise the
                      duration to {Math.ceil(duration)}s or more to play it in
                      full.
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ConfirmDialog
        isOpen={pendingRemoval !== null}
        title="Remove slide"
        description={
          pendingRemovalItem
            ? `Remove ${pendingRemoval?.label} from the hero? This only changes the homepage — Shopify is not modified.`
            : undefined
        }
        confirmLabel="Remove"
        isDestructive
        onConfirm={() => {
          if (pendingRemoval) {
            handleRemove(pendingRemoval.id);
          }
          setPendingRemoval(null);
        }}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
