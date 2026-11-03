import { prepareProductDescriptionHtml } from "lib/shopify/description-html";
import { describe, expect, it } from "vitest";

describe("product description HTML", () => {
  describe("product links", () => {
    const links = prepareProductDescriptionHtml(
      [
        '<p><a href="/products/sphere-bubblegum-left-skateboard-deck">Bubblegum graphic</a></p>',
        '<p><a href="/products/toucan-pro-trucks?variant=123#fit">Toucan Pro</a></p>',
        "<p><a href = '/products/skateboard-griptape-sphere'>OS780</a></p>",
        '<p><a href="/product/already-correct">Legacy link</a></p>',
        '<p><a href="https://weskateco.com/products/external-product">External link</a></p>',
      ].join(""),
      "en",
    );

    it("keeps a relative Shopify product link on the storefront route", () => {
      expect(links).toContain(
        'href="/products/sphere-bubblegum-left-skateboard-deck"',
      );
    });

    it("preserves query strings and fragments", () => {
      expect(links).toContain(
        'href="/products/toucan-pro-trucks?variant=123#fit"',
      );
    });

    it("supports spaced attributes and single-quoted hrefs", () => {
      expect(links).toContain("href = '/products/skateboard-griptape-sphere'");
    });

    it("normalises a legacy singular product link to the plural route", () => {
      expect(links).toContain('href="/products/already-correct"');
    });

    it("leaves an absolute external product URL unchanged", () => {
      expect(links).toContain(
        'href="https://weskateco.com/products/external-product"',
      );
    });

    it("does not rewrite non-href /products text", () => {
      expect(
        prepareProductDescriptionHtml(
          "<p>Shopify calls these /products links.</p>",
          "en",
        ),
      ).not.toContain('href="/product');
    });

    it("localizes rewritten product links", () => {
      const hindi = prepareProductDescriptionHtml(
        '<p><a href="/products/toucan-pro-trucks">Toucan Pro</a></p>',
        "hi",
      );

      expect(hindi).toContain('href="/hi/products/toucan-pro-trucks"');
    });
  });

  describe("tables", () => {
    const table = prepareProductDescriptionHtml(
      [
        "<table>",
        "<thead><tr><th>Width</th><th>Length</th><th>Trucks</th></tr></thead>",
        '<tbody><tr><td>8</td><td>31.875</td><td><a href="/products/double-hollow-skateboard-trucks">Toucan Pro</a></td></tr></tbody>',
        "</table>",
      ].join(""),
      "en",
    );

    it("wraps product tables once", () => {
      expect(
        table.match(/class="product-description-table-scroll"/g),
      ).toHaveLength(1);
    });

    it("gives the table scroll region accessible metadata", () => {
      expect(table).toContain(
        'role="region" aria-label="Scrollable product specifications" tabindex="0"',
      );
    });

    it("keeps the table inside its scroll region", () => {
      // indexOf is -1 when missing, so assert both are present before ordering.
      const scroll = table.indexOf("product-description-table-scroll");
      const tableTag = table.indexOf("<table");

      expect(scroll).toBeGreaterThanOrEqual(0);
      expect(scroll).toBeLessThan(tableTag);
    });

    it("rewrites product links inside table cells", () => {
      expect(table).toContain(
        'href="/products/double-hollow-skateboard-trucks"',
      );
    });
  });

  describe("passthrough", () => {
    it("leaves descriptions without product links or tables unchanged", () => {
      const plain = "<p>Plain description with <strong>markup</strong>.</p>";

      expect(prepareProductDescriptionHtml(plain, "en")).toBe(plain);
    });

    it("handles an empty description", () => {
      expect(prepareProductDescriptionHtml("", "en")).toBe("");
    });
  });
});
