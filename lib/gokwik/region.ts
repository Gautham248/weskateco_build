"use client";

import { useEffect, useState } from "react";
import { isGoKwikCountry } from "./country";

/**
 * Whether to offer GoKwik checkout and Snapmint EMI to this shopper. Starts
 * as available on the server and first render (most shoppers are in India),
 * then reads the country cookie after mount.
 */
export function useGoKwikAvailable(): boolean {
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    setAvailable(isGoKwikCountry(document.cookie));
  }, []);
  return available;
}
