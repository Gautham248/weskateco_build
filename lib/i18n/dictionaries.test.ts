import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import en from "locales/en.json";
import hi from "locales/hi.json";
import { describe, expect, it } from "vitest";

const english: Record<string, string> = en;
const hindi: Record<string, string> = hi;

const namespaces = [
  ...new Set(Object.keys(english).map((key) => key.split(".")[0])),
];

/** Source files that can look up dictionary keys. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")
      ? [path]
      : [];
  });
}

/**
 * Every dictionary key the code names: the literal argument of each t("…")
 * call, plus any string literal in a known namespace ("nav.home"), which
 * catches keys kept in lookup tables and passed to t() later. The client shows
 * a missing key as the raw key, so a typo here ends up on the page.
 */
function keysUsedInCode(): Map<string, string> {
  const call = /\bt\(\s*["'`]([^"'`$]+)["'`]/g;
  const literal = new RegExp(
    `["'\`]((?:${namespaces.join("|")})\\.[a-z0-9_]+(?:\\.[a-z0-9_]+)*)["'\`]`,
    "g",
  );
  const used = new Map<string, string>();
  for (const file of ["app", "components", "lib"].flatMap(sourceFiles)) {
    const source = readFileSync(file, "utf8");
    for (const pattern of [call, literal]) {
      for (const [, key] of source.matchAll(pattern)) {
        if (!used.has(key!)) used.set(key!, file);
      }
    }
  }
  return used;
}

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort();

describe("dictionaries", () => {
  it("have the same keys in English and Hindi", () => {
    expect(Object.keys(hindi).sort()).toEqual(Object.keys(english).sort());
  });

  it("have no empty strings", () => {
    const empty = Object.entries({ ...english, ...hindi })
      .filter(([, value]) => !value.trim())
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it("use the same placeholders in both languages", () => {
    const mismatched = Object.keys(english).filter(
      (key) =>
        placeholders(english[key]!).join() !==
        placeholders(hindi[key] ?? "").join(),
    );
    expect(mismatched).toEqual([]);
  });

  it("have every key the code looks up", () => {
    const used = keysUsedInCode();
    // Guards the scan itself: finding nothing would pass vacuously
    expect(used.size).toBeGreaterThan(200);
    const missing = [...used]
      .filter(([key]) => !(key in english) || !(key in hindi))
      .map(([key, file]) => `${key} (${file})`);
    expect(missing).toEqual([]);
  });
});
