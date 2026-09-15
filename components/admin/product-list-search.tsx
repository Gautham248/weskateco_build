"use client";

import { DebouncedSearchInput } from "components/admin/debounced-search-input";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Drives the products list through the URL, so the server component keeps doing
 * the search (and the query stays shareable / bookmarkable). Dropping the
 * cursor resets to the first page whenever the query changes.
 */
export function ProductListSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <DebouncedSearchInput
      initialValue={initialQuery}
      placeholder="Search products…"
      isSearching={isPending}
      onSearch={(query) => {
        const trimmed = query.trim();
        const href = trimmed
          ? `/admin/products?q=${encodeURIComponent(trimmed)}`
          : "/admin/products";

        startTransition(() => {
          router.replace(href);
        });
      }}
    />
  );
}
