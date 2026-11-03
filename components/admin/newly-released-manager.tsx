"use client";

import { ConfirmDialog } from "components/admin/confirm-dialog";
import { ProductFilters } from "components/admin/product-filters";
import {
  ProductPhotoPicker,
  type PhotoOption,
} from "components/admin/product-photo-picker";
import { ResultsPager } from "components/admin/results-pager";
import clsx from "clsx";
import {
  getProductPhotoOptionsAction,
  saveNewlyReleasedAction,
} from "lib/admin/actions";
import { paginate } from "lib/admin/pagination";
import {
  applyAdminProductFilters,
  countActiveAdminFilters,
  deriveAdminFacets,
  EMPTY_ADMIN_PRODUCT_FILTERS,
  toggleFacetValue,
  type AdminProductFilters,
  type AdminProductOverrideSummary,
} from "lib/admin/product-filters";
import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import type { ShopifyProductSummary } from "lib/shopify/types";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export type NewlyReleasedManagerItem = {
  productHandle: string;
  shopifyProductId: string | null;
  cardImageUrl: string | null;
  heroImageUrl: string | null;
  subtitle: string | null;
  title: string;
  vendor: string;
  thumbnailUrl: string | null;
  photos: PhotoOption[];
  photosLoading: boolean;
};

const EDIT_DEBOUNCE_MS = 600;

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const moverClasses =
  "cursor-pointer rounded-sm border border-neutral-300 px-2 py-1 text-xs transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900";

/**
 * Every change persists on its own — adding, removing, reordering, editing.
 * There is deliberately no separate "Save" step: a click on Add has to mean the
 * product is in the carousel, not that it is queued up for a later button.
 */
export function NewlyReleasedManager({
  initialItems,
  catalog,
  overrides,
  truncated,
}: {
  initialItems: NewlyReleasedManagerItem[];
  catalog: ShopifyProductSummary[];
  overrides: AdminProductOverrideSummary[];
  truncated: boolean;
}) {
  const [items, setItems] = useState<NewlyReleasedManagerItem[]>(initialItems);
  const [filters, setFilters] = useState<AdminProductFilters>(
    EMPTY_ADMIN_PRODUCT_FILTERS,
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<{
    index: number;
    title: string;
  } | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [isAdding, startAdd] = useTransition();
  const [isSaving, startSave] = useTransition();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addedHandles = new Set(items.map((item) => item.productHandle));

  // Facets follow the other active filters, so each selection narrows what the
  // remaining groups offer.
  const facets = useMemo(
    () => deriveAdminFacets(catalog, overrides, filters),
    [catalog, overrides, filters],
  );

  const visible = useMemo(
    () => applyAdminProductFilters(catalog, overrides, filters),
    [catalog, overrides, filters],
  );

  const activeCount = countActiveAdminFilters(filters);

  const {
    items: pageItems,
    currentPage,
    totalPages,
    rangeStart,
    rangeEnd,
  } = paginate(visible, page);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // A changed filter set is a new result set, so start it at the first page.
  useEffect(() => {
    setPage(1);
  }, [filters]);

  function persist(next: NewlyReleasedManagerItem[], delayMs = 0) {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    setSaveState("saving");

    saveTimerRef.current = setTimeout(() => {
      startSave(async () => {
        try {
          const result = await saveNewlyReleasedAction(
            next.map((item) => ({
              productHandle: item.productHandle,
              shopifyProductId: item.shopifyProductId,
              cardImageUrl: item.cardImageUrl,
              heroImageUrl: item.heroImageUrl,
              subtitle: item.subtitle,
            })),
          );

          if (result?.error) {
            setError(result.error);
            setSaveState("idle");
            return;
          }

          setError(null);
          setSaveState("saved");
        } catch (saveError) {
          console.error("Saving the carousel failed:", saveError);
          setError("Could not save. Check your connection and try again.");
          setSaveState("idle");
        }
      });
    }, delayMs);
  }

  function update(index: number, patch: Partial<NewlyReleasedManagerItem>) {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );

    setItems(next);
    persist(next, EDIT_DEBOUNCE_MS);
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

  function handleRemove(index: number) {
    const next = items.filter((_, i) => i !== index);

    setItems(next);
    persist(next);
  }

  function handleAdd(product: ShopifyProductSummary) {
    if (addedHandles.has(product.handle)) {
      setError(`"${product.title}" is already in the carousel.`);
      return;
    }

    setError(null);

    const next = [
      ...items,
      {
        productHandle: product.handle,
        shopifyProductId: product.id,
        cardImageUrl: null,
        heroImageUrl: null,
        subtitle: null,
        title: product.title,
        vendor: product.vendor,
        thumbnailUrl: product.featuredImage?.url ?? null,
        photos: [],
        photosLoading: true,
      },
    ];

    setItems(next);
    // Persist straight away, so the product is genuinely in the carousel.
    persist(next);

    toast.success(`${product.title} added.`);

    startAdd(async () => {
      try {
        const photos = await getProductPhotoOptionsAction(product.handle);

        setItems((prev) =>
          prev.map((item) =>
            item.productHandle === product.handle
              ? { ...item, photos, photosLoading: false }
              : item,
          ),
        );
      } catch (photoError) {
        console.error(
          "Could not load photos for the added product:",
          photoError,
        );
        setItems((prev) =>
          prev.map((item) =>
            item.productHandle === product.handle
              ? { ...item, photosLoading: false }
              : item,
          ),
        );
        setError(
          `Added "${product.title}", but its photos could not be loaded. Reload to retry the photos.`,
        );
      }
    });
  }

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
            onClick={() => {
              setError(null);
              persist(items);
            }}
            className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs font-bold tracking-wider uppercase dark:border-red-800"
          >
            Retry save
          </button>
        </div>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
            Add a product
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Search the Shopify catalog — products are added to the carousel as
            soon as you click Add.
          </p>
        </div>

        <ProductFilters
          facets={facets}
          filters={filters}
          activeCount={activeCount}
          isOpen={isFilterPanelOpen}
          onToggleOpen={() => setIsFilterPanelOpen((open) => !open)}
          onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onToggleFacet={(key, value) =>
            setFilters((prev) => ({
              ...prev,
              [key]: toggleFacetValue(prev[key], value),
            }))
          }
          onClear={() => setFilters(EMPTY_ADMIN_PRODUCT_FILTERS)}
        />

        {activeCount === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Search or filter the catalog to find products to add.
          </p>
        ) : (
          <>
            {truncated ? (
              <p className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                This store has more products than the admin list loads at once,
                so the list below is partial.
              </p>
            ) : null}

            {visible.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No products match these filters.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-neutral-200 rounded-sm border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {pageItems.map((product) => {
                    const alreadyAdded = addedHandles.has(product.handle);

                    return (
                      <li
                        key={product.handle}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {product.featuredImage?.url ? (
                            <img
                              src={shopifyImageUrl(
                                product.featuredImage.url,
                                SHOPIFY_IMAGE_WIDTH.thumb,
                              )}
                              alt={product.title}
                              className="h-10 w-10 flex-none rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                            />
                          ) : (
                            <div className="h-10 w-10 flex-none rounded-sm bg-neutral-100 dark:bg-neutral-900" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {product.title}
                            </p>
                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                              {product.vendor || product.handle}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={alreadyAdded || isAdding}
                          onClick={() => handleAdd(product)}
                          className={clsx(
                            "flex-none cursor-pointer rounded-sm border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                            alreadyAdded
                              ? "cursor-not-allowed border-neutral-300 text-neutral-400 dark:border-neutral-700"
                              : "border-black bg-black text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100",
                          )}
                        >
                          {alreadyAdded ? "Added" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <ResultsPager
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  total={visible.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
              Carousel order
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {items.length === 0
                ? "No products yet — search above to add the first one."
                : `${items.length} product${items.length === 1 ? "" : "s"} will show in this order.`}
            </p>
          </div>

          <span
            aria-live="polite"
            className={clsx(
              "text-xs",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-neutral-500 dark:text-neutral-400",
            )}
          >
            {isSaving || saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "All changes saved"
                : null}
          </span>
        </div>

        {items.length === 0 ? null : (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li
                key={item.productHandle}
                className="space-y-5 rounded-sm border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-black text-[11px] font-bold text-white dark:bg-white dark:text-black">
                      {index + 1}
                    </span>
                    {item.thumbnailUrl ? (
                      <img
                        src={shopifyImageUrl(
                          item.thumbnailUrl,
                          SHOPIFY_IMAGE_WIDTH.thumb,
                        )}
                        alt={item.title}
                        className="h-10 w-10 flex-none rounded-sm bg-neutral-100 object-contain dark:bg-neutral-900"
                      />
                    ) : (
                      <div className="h-10 w-10 flex-none rounded-sm bg-neutral-100 dark:bg-neutral-900" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {item.productHandle}
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
                        setPendingRemoval({ index, title: item.title })
                      }
                      className="cursor-pointer rounded-sm border border-red-300 px-2 py-1 text-xs text-red-600 dark:border-red-900 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <ProductPhotoPicker
                    label="Card photo"
                    photos={item.photos}
                    value={item.cardImageUrl}
                    fallbackLabel="Product default"
                    isLoading={item.photosLoading}
                    onChange={(url) => update(index, { cardImageUrl: url })}
                  />
                  <ProductPhotoPicker
                    label="Large photo"
                    photos={item.photos}
                    value={item.heroImageUrl}
                    fallbackLabel="Product default"
                    isLoading={item.photosLoading}
                    onChange={(url) => update(index, { heroImageUrl: url })}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`subtitle-${item.productHandle}`}
                    className="mb-2 block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
                  >
                    Second line
                  </label>
                  <input
                    id={`subtitle-${item.productHandle}`}
                    type="text"
                    value={item.subtitle ?? ""}
                    placeholder={item.vendor || "Product default"}
                    onChange={(event) =>
                      update(index, { subtitle: event.target.value })
                    }
                    className={inputClasses}
                  />
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Leave blank to show the product&apos;s vendor.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        isOpen={pendingRemoval !== null}
        title="Remove product"
        description={
          pendingRemoval
            ? `Remove "${pendingRemoval.title}" from the newly released carousel? This only changes the homepage — Shopify is not modified.`
            : undefined
        }
        confirmLabel="Remove"
        isDestructive
        onConfirm={() => {
          if (pendingRemoval) {
            handleRemove(pendingRemoval.index);
          }
          setPendingRemoval(null);
        }}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
