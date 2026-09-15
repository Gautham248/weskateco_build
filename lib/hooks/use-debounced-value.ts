"use client";

import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stopped changing for `delayMs`. Used to turn
 * keystrokes into a single search request per pause rather than one per key.
 */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
