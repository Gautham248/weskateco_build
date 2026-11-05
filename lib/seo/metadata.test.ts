import { describe, expect, it } from "vitest";
import {
  localeAlternates,
  openGraph,
  openGraphLocale,
  documentTitle,
  pageQuery,
  siteShareImage,
  SITE_NAME,
  socialTitle,
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

describe("summarize edge cases", () => {
  it("never splits an emoji at the cut", () => {
    const summary = summarize(`${"w ".repeat(79)}🛹🛹 more words`, 160);
    expect(summary).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/);
    expect(Array.from(summary).length).toBeLessThanOrEqual(160);
  });

  it("keeps a sentence that ends right at the limit", () => {
    const sentence = `${"x".repeat(158)}.`;
    expect(summarize(`${sentence} ${"y".repeat(40)}`, 160)).toBe(sentence);
  });

  it("ends at a Hindi full stop", () => {
    const summary = summarize("यह एक डेक है। ".repeat(20), 160);
    expect(summary.endsWith("है।")).toBe(true);
    expect(Array.from(summary).length).toBeLessThanOrEqual(160);
  });

  it("cuts text without spaces at the limit, with an ellipsis", () => {
    expect(summarize("a".repeat(300), 160)).toBe(`${"a".repeat(159)}…`);
  });
});

describe("titles from Shopify", () => {
  it("adds the site name to social titles only when it's missing", () => {
    expect(socialTitle("Toucan T-Tool")).toBe(`Toucan T-Tool | ${SITE_NAME}`);
    expect(socialTitle(`Toucan T-Tool – ${SITE_NAME}`)).toBe(
      `Toucan T-Tool – ${SITE_NAME}`,
    );
  });

  it("skips the layout's suffix when the title already names the site", () => {
    expect(documentTitle("Deck")).toBe("Deck");
    expect(documentTitle(`Deck – ${SITE_NAME.toLowerCase()}`)).toEqual({
      absolute: `Deck – ${SITE_NAME.toLowerCase()}`,
    });
  });
});

describe("withPageMetadata share images", () => {
  it("leaves the homepage to its own opengraph-image file", async () => {
    const metadata = await withPageMetadata("/", { title: "Home" })({
      params: Promise.resolve({ locale: "en" }),
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });
});

describe("withPageMetadata with translated fields", () => {
  const params = (locale: string) => ({ params: Promise.resolve({ locale }) });
  const generate = withPageMetadata("/refund-policy", (locale) =>
    locale === "hi"
      ? { title: "रिफ़ंड पॉलिसी", description: "रिटर्न और रिफ़ंड।" }
      : { title: "Refund Policy", description: "Returns and refunds." },
  );

  it("uses each locale's own title and description", async () => {
    const hindi = await generate(params("hi"));
    expect(hindi).toMatchObject({
      title: "रिफ़ंड पॉलिसी",
      description: "रिटर्न और रिफ़ंड।",
    });
    expect(hindi.openGraph).toMatchObject({
      title: `रिफ़ंड पॉलिसी | ${SITE_NAME}`,
      description: "रिटर्न और रिफ़ंड।",
      locale: "hi_IN",
      url: "/hi/refund-policy",
    });
  });

  it("links the same pair of URLs from both languages", async () => {
    const english = await generate(params("en"));
    const hindi = await generate(params("hi"));
    expect(english.title).toBe("Refund Policy");
    expect(english.alternates?.canonical).toBe("/refund-policy");
    expect(hindi.alternates?.canonical).toBe("/hi/refund-policy");
    expect(hindi.alternates?.languages).toEqual(english.alternates?.languages);
  });

  it("matches the fixed-object form for the same fields", async () => {
    const fixed = withPageMetadata("/refund-policy", {
      title: "Refund Policy",
      description: "Returns and refunds.",
    });
    expect(await generate(params("en"))).toEqual(await fixed(params("en")));
  });
});
