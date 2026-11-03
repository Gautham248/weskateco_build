import { describe, expect, it } from "vitest";
import {
  localeAlternates,
  openGraph,
  openGraphLocale,
  pageQuery,
  siteShareImage,
  SITE_NAME,
  summarize,
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
      alternates: {
        canonical: "/about-us",
        languages: {
          en: "/about-us",
          hi: "/hi/about-us",
          "x-default": "/about-us",
        },
      },
      openGraph: {
        siteName: SITE_NAME,
        type: "website",
        locale: "en_IN",
        url: "/about-us",
        images: ["/opengraph-image"],
        title: `About Us | ${SITE_NAME}`,
        description: "Who we are.",
      },
    });
  });

  it("uses the Hindi URL and locale for Hindi pages", async () => {
    const metadata = await withPageMetadata("/about-us", { title: "About Us" })(
      params("hi"),
    );
    expect(metadata.alternates).toMatchObject({ canonical: "/hi/about-us" });
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

describe("localeAlternates", () => {
  it("links every locale's version, with English as the default", () => {
    expect(localeAlternates("/store", "hi")).toEqual({
      canonical: "/hi/store",
      languages: {
        en: "/store",
        hi: "/hi/store",
        "x-default": "/store",
      },
    });
  });

  it("uses /hi, not the redirecting /hi/, for the Hindi homepage", () => {
    expect(localeAlternates("/", "hi")).toMatchObject({
      canonical: "/hi",
      languages: { en: "/", hi: "/hi" },
    });
  });

  it("keeps a query on every link", () => {
    expect(localeAlternates("/store", "en", "?page=2")).toMatchObject({
      canonical: "/store?page=2",
      languages: { hi: "/hi/store?page=2" },
    });
  });
});

describe("pageQuery", () => {
  it.each([
    [undefined, ""],
    ["1", ""],
    ["0", ""],
    ["-2", ""],
    ["abc", ""],
    ["2.5", ""],
    ["2", "?page=2"],
    [["3", "4"], ""],
  ])("page %j -> %j", (page, expected) => {
    expect(pageQuery(page)).toBe(expected);
  });
});

describe("withPageMetadata on paginated listings", () => {
  const props = (page?: string) => ({
    params: Promise.resolve({ locale: "en" }),
    searchParams: Promise.resolve(page ? { page, sort: "price-asc" } : {}),
  });

  it("keeps ?page= on later pages and drops other params", async () => {
    const generate = withPageMetadata(
      "/store",
      { title: "Store" },
      {
        paginated: true,
      },
    );
    const metadata = await generate(props("2"));
    expect(metadata.alternates?.canonical).toBe("/store?page=2");
    expect(metadata.openGraph).toMatchObject({ url: "/store?page=2" });
    expect((await generate(props())).alternates?.canonical).toBe("/store");
  });

  it("ignores ?page= on pages that aren't listings", async () => {
    const metadata = await withPageMetadata("/about-us", { title: "About" })(
      props("2"),
    );
    expect(metadata.alternates?.canonical).toBe("/about-us");
  });
});

describe("siteShareImage", () => {
  it("is the locale's site image route", () => {
    expect(siteShareImage("en")).toEqual(["/opengraph-image"]);
    expect(siteShareImage("hi")).toEqual(["/hi/opengraph-image"]);
  });

  it("is what fixed-metadata pages share with, unless they set their own", async () => {
    const params = { params: Promise.resolve({ locale: "hi" }) };
    expect(
      (await withPageMetadata("/contact", { title: "Contact" })(params))
        .openGraph,
    ).toMatchObject({ images: ["/hi/opengraph-image"] });
    expect(
      (
        await withPageMetadata("/contact", {
          title: "Contact",
          openGraph: { images: ["/contact.png"] },
        })(params)
      ).openGraph,
    ).toMatchObject({ images: ["/contact.png"] });
  });

  it("isn't added by openGraph() itself, so pages with an image file keep it", () => {
    expect(openGraph("en", "/store/decks")).not.toHaveProperty("images");
  });
});

describe("summarize", () => {
  it("leaves short text alone, tidying whitespace", () => {
    expect(summarize("  A deck.\n\nFor   parks. ")).toBe("A deck. For parks.");
  });

  it("ends at a sentence when one fits", () => {
    const text = `${"Seven plies of maple. ".repeat(5)}And more after that point.`;
    const summary = summarize(text, 100);
    expect(summary.length).toBeLessThanOrEqual(100);
    expect(summary.endsWith("maple.")).toBe(true);
  });

  it("otherwise ends at a word, with an ellipsis", () => {
    const text = "word ".repeat(60);
    const summary = summarize(text, 50);
    expect(summary.length).toBeLessThanOrEqual(50);
    expect(summary).toMatch(/word…$/);
  });

  it("doesn't leave dangling punctuation before the ellipsis", () => {
    expect(summarize(`${"a".repeat(30)}, ${"b".repeat(40)}`, 40)).toBe(
      `${"a".repeat(30)}…`,
    );
  });
});
