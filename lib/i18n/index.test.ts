import en from "locales/en.json";
import hi from "locales/hi.json";
import { describe, expect, it } from "vitest";
import {
  createTranslator,
  getDictionary,
  getLocalizedField,
  getLocalizedPath,
  getShopifyLanguage,
  getTranslation,
  localizeHref,
} from "./index";

describe("getTranslation", () => {
  it("returns the string for the requested locale", () => {
    expect(getTranslation("en", "nav.home")).toBe("Home");
    expect(getTranslation("hi", "nav.home")).toBe("होम");
  });

  it("falls back to English for an unsupported locale", () => {
    expect(getTranslation("fr", "nav.home")).toBe("Home");
  });

  it("falls back to the key itself when no locale has it", () => {
    expect(getTranslation("hi", "does.not.exist")).toBe("does.not.exist");
  });

  it("is bound to a locale by createTranslator", () => {
    const t = createTranslator("hi");
    expect(t("nav.home")).toBe("होम");
  });
});

describe("dictionaries", () => {
  it("returns the English dictionary for an unsupported locale", () => {
    expect(getDictionary("fr")).toBe(getDictionary("en"));
  });

  it("has a Hindi string for every English key", () => {
    const missing = Object.keys(en).filter(
      (key) => !(hi as Record<string, string>)[key],
    );
    expect(missing).toEqual([]);
  });
});

describe("getLocalizedField", () => {
  const doc = { title_en: "Skateparks", title_hi: "स्केटपार्क", slug: "parks" };

  it("reads the field for the requested locale", () => {
    expect(getLocalizedField(doc, "title", "hi")).toBe("स्केटपार्क");
  });

  it("falls back to English, then the unsuffixed field, then empty", () => {
    expect(getLocalizedField({ title_en: "Parks" }, "title", "hi")).toBe(
      "Parks",
    );
    expect(getLocalizedField(doc, "slug", "hi")).toBe("parks");
    expect(getLocalizedField(doc, "missing", "hi")).toBe("");
  });
});

describe("getLocalizedPath", () => {
  it.each([
    ["/store", "en", "/store"],
    ["store", "en", "/store"],
    ["/", "en", "/"],
    ["/store", "hi", "/hi/store"],
    // /hi/ would redirect to /hi
    ["/", "hi", "/hi"],
    ["product/deck", "hi", "/hi/product/deck"],
  ])("maps %s in %s to %s", (path, locale, expected) => {
    expect(getLocalizedPath(path, locale)).toBe(expected);
  });
});

describe("localizeHref", () => {
  it.each([
    ["/academy", "/hi/academy"],
    ["/", "/hi"],
    ["/?q=deck", "/hi?q=deck"],
    ["/#top", "/hi#top"],
    [
      "/store/skateboards?sort=price-asc",
      "/hi/store/skateboards?sort=price-asc",
    ],
    ["/products/deck#reviews", "/hi/products/deck#reviews"],
  ])("adds the Hindi prefix to %s", (href, expected) => {
    expect(localizeHref(href, "hi")).toBe(expected);
  });

  it.each([
    // Already localized, e.g. by getLocalizedPath
    "/hi",
    "/hi/store",
    "/hi?q=deck",
    "/en/store",
    // Outside the storefront
    "/account",
    "/account/orders",
    "/services/login_with_shop",
    "/api/cart",
    "/admin/products",
    "/studio",
    "/_next/static/chunk.js",
    // Static files
    "/icons/logo.png",
    "/fonts/archivo.woff2",
    "/hero/banner.jpg",
    "/favicon.ico",
    // Not internal paths
    "https://instagram.com/weskateco",
    "//cdn.shopify.com/image.jpg",
    "mailto:info@weskateco.com",
    "#top",
    "?page=2",
  ])("leaves %s alone", (href) => {
    expect(localizeHref(href, "hi")).toBe(href);
  });

  it("doesn't mistake paths that merely start like a skipped prefix", () => {
    expect(localizeHref("/accounts-help", "hi")).toBe("/hi/accounts-help");
    expect(localizeHref("/history", "hi")).toBe("/hi/history");
    expect(localizeHref("/apis", "hi")).toBe("/hi/apis");
  });

  it("leaves every English href unchanged", () => {
    for (const href of ["/", "/academy", "/store?sort=price-asc", "/account"]) {
      expect(localizeHref(href, "en")).toBe(href);
    }
  });
});

describe("getShopifyLanguage", () => {
  it("asks Shopify for Hindi on Hindi pages", () => {
    expect(getShopifyLanguage("hi")).toBe("HI");
  });

  it.each([undefined, "", "en", "fr", "HI"])(
    "sends no language for %s, so Shopify answers in English",
    (locale) => {
      expect(getShopifyLanguage(locale)).toBeUndefined();
    },
  );
});
