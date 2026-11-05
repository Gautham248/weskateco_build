// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GOKWIK_LOADED_EVENT,
  GOKWIK_WAIT_MS,
  goKwikReady,
  waitForGoKwik,
  waitForGoKwikSdk,
} from "./sdk";

function setCountry(country: string) {
  document.cookie = `country=${country}; path=/`;
}

/** Simulates GoKwik's SDK arriving on the page */
function loadGoKwik() {
  window.triggerGokwikCustomCheckout = vi.fn();
  window.dispatchEvent(new Event(GOKWIK_LOADED_EVENT));
}

beforeEach(() => {
  vi.useFakeTimers();
  window.merchantInfo = { mid: "m1" };
});

afterEach(() => {
  vi.useRealTimers();
  delete window.triggerGokwikCustomCheckout;
  document.cookie = "country=; path=/; max-age=0";
});

describe("goKwikReady", () => {
  it("is true once GoKwik's checkout function and config are on the page", () => {
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(goKwikReady()).toBe(true);
  });

  it("is false while GoKwik's checkout function isn't defined yet", () => {
    expect(goKwikReady()).toBe(false);
  });

  it("is false without GoKwik's config, which says which cart to check out", () => {
    window.triggerGokwikCustomCheckout = vi.fn();
    window.merchantInfo = undefined;
    expect(goKwikReady()).toBe(false);
  });
});

describe("waitForGoKwikSdk", () => {
  it("keeps waiting when the loaded event fires before GoKwik finishes setting up", async () => {
    const ready = waitForGoKwikSdk(GOKWIK_WAIT_MS);
    // GoKwik's script has loaded, but defines its checkout function later
    window.dispatchEvent(new Event(GOKWIK_LOADED_EVENT));
    await vi.advanceTimersByTimeAsync(1000);
    window.triggerGokwikCustomCheckout = vi.fn();
    await vi.advanceTimersByTimeAsync(500);
    expect(await ready).toBe(true);
  });

  it("stops waiting when cancelled", async () => {
    const cancel = new AbortController();
    const ready = waitForGoKwikSdk(GOKWIK_WAIT_MS, cancel.signal);
    cancel.abort();
    expect(await ready).toBe(false);
  });
});

describe("waitForGoKwik", () => {
  it("is false at once outside India, even with the SDK on the page", async () => {
    setCountry("US");
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(false);
  });

  it("is true at once in India when the SDK has loaded", async () => {
    setCountry("IN");
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(true);
  });

  it("waits for an SDK that is still loading", async () => {
    setCountry("IN");
    const ready = waitForGoKwik();
    await vi.advanceTimersByTimeAsync(GOKWIK_WAIT_MS - 1000);
    loadGoKwik();
    expect(await ready).toBe(true);
  });

  it("gives up when the SDK doesn't arrive in time", async () => {
    setCountry("IN");
    const ready = waitForGoKwik();
    await vi.advanceTimersByTimeAsync(GOKWIK_WAIT_MS);
    expect(await ready).toBe(false);
  });

  it("uses Shopify's checkout when the country is unknown", async () => {
    window.triggerGokwikCustomCheckout = vi.fn();
    expect(await waitForGoKwik()).toBe(false);
  });
});
