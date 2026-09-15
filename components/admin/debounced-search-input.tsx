"use client";

import { useDebouncedValue } from "lib/hooks/use-debounced-value";
import { useEffect, useRef, useState } from "react";

/**
 * Search box that reports every pause in typing, so callers never need a submit
 * button. Fires once per debounce window, and not on mount — the server has
 * usually already rendered results for the initial value.
 */
export function DebouncedSearchInput({
  initialValue = "",
  placeholder = "Search…",
  onSearch,
  isSearching = false,
  delayMs = 350,
}: {
  initialValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  isSearching?: boolean;
  delayMs?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, delayMs);

  const onSearchRef = useRef(onSearch);
  const isFirstRun = useRef(true);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    onSearchRef.current(debounced);
  }, [debounced]);

  return (
    <div role="search" className="relative w-full">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={placeholder}
        className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
      />

      {isSearching ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <svg
            className="h-4 w-4 animate-spin text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
