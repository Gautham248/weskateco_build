"use client";

import { useEffect, useState } from "react";
import { isGoKwikCountry } from "./country";

/**
 * Whether to offer GoKwik checkout and Snapmint EMI to this shopper. Starts
 * as unavailable on the server and first render, since the country cookie can
 * only be read in the browser, then reads it after mount. Snapmint therefore
 * appears a moment late in India rather than flashing up elsewhere.
 */
export function useGoKwikAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    setAvailable(isGoKwikCountry(document.cookie));
  }, []);
  return available;
}
