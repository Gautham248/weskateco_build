import { describe, expect, it } from "vitest";
import {
  openGraph,
  openGraphLocale,
  SITE_NAME,
  withPageMetadata,
} from "./metadata";

describe("openGraph", () => {
  it("fills in site name, type, locale and the page URL", () => {
    expect(openGraph("en", "/store")).toEqual({
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      url: "/store",
    });
  });

  it("uses the Hindi URL and locale for Hindi pages", () => {
    expect(openGraph("hi", "/store")).toMatchObject({
      locale: "hi_IN",
      url: "/hi/store",
    });
  });

  it("lets a page add or override fields", () => {
    expect(
      openGraph("en", "/about", { type: "article", title: "About" }),
    ).toMatchObject({ type: "article", title: "About", url: "/about" });
  });
});

describe("openGraphLocale", () => {
  it.each([
    ["en", "en_IN"],
    ["hi", "hi_IN"],
    ["fr", "en_IN"],
  ])("%s -> %s", (locale, expected) => {
    expect(openGraphLocale(locale)).toBe(expected);
  });
});

describe("withPageMetadata", () => {
  const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

  it("adds the canonical and Open Graph tags from the page's own fields", async () => {
    const generate = withPageMetadata("/about-us", {
      title: "About Us",
      description: "Who we are.",
    });
    expect(await generate(params("en"))).toEqual({
      title: "About Us",
      description: "Who we are.",
      alternates: { canonical: "/about-us" },
      openGraph: {
        siteName: SITE_NAME,
        type: "website",
        locale: "en_IN",
        url: "/about-us",
        title: `About Us | ${SITE_NAME}`,
        description: "Who we are.",
      },
    });
  });

  it("uses the Hindi URL and locale for Hindi pages", async () => {
    const metadata = await withPageMetadata("/about-us", { title: "About Us" })(
      params("hi"),
    );
    expect(metadata.alternates).toEqual({ canonical: "/hi/about-us" });
    expect(metadata.openGraph).toMatchObject({
      url: "/hi/about-us",
      locale: "hi_IN",
    });
  });

  it("uses an absolute title as-is for Open Graph", async () => {
    const metadata = await withPageMetadata("/", {
      title: { absolute: "Buy Skateboards | WeSkate Co" },
    })(params("en"));
    expect(metadata.openGraph).toMatchObject({
      title: "Buy Skateboards | WeSkate Co",
    });
  });

  it("lets the page's own openGraph fields win", async () => {
    const metadata = await withPageMetadata("/guides/deck-guide", {
      title: "Deck Guide",
      openGraph: { type: "article" },
    })(params("en"));
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      title: `Deck Guide | ${SITE_NAME}`,
    });
  });
});
