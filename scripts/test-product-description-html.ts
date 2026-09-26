import { prepareProductDescriptionHtml } from "lib/shopify/description-html";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function includes(name: string, actual: string, expected: string) {
  check(
    name,
    actual.includes(expected),
    `expected output to include ${JSON.stringify(expected)}`,
  );
}

function run() {
  console.log("\nproduct description HTML");

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

  includes(
    "keeps a relative Shopify product link on the storefront route",
    links,
    'href="/products/sphere-bubblegum-left-skateboard-deck"',
  );
  includes(
    "preserves query strings and fragments",
    links,
    'href="/products/toucan-pro-trucks?variant=123#fit"',
  );
  includes(
    "supports spaced attributes and single-quoted hrefs",
    links,
    "href = '/products/skateboard-griptape-sphere'",
  );
  check(
    "normalises a legacy singular product link to the plural route",
    links.includes('href="/products/already-correct"'),
  );
  check(
    "leaves an absolute external product URL unchanged",
    links.includes('href="https://weskateco.com/products/external-product"'),
  );
  check(
    "does not rewrite non-href /products text",
    !prepareProductDescriptionHtml(
      "<p>Shopify calls these /products links.</p>",
      "en",
    ).includes('href="/product'),
  );

  const hindi = prepareProductDescriptionHtml(
    '<p><a href="/products/toucan-pro-trucks">Toucan Pro</a></p>',
    "hi",
  );
  includes(
    "localizes rewritten product links",
    hindi,
    'href="/hi/products/toucan-pro-trucks"',
  );

  const table = prepareProductDescriptionHtml(
    [
      "<table>",
      "<thead><tr><th>Width</th><th>Length</th><th>Trucks</th></tr></thead>",
      '<tbody><tr><td>8</td><td>31.875</td><td><a href="/products/double-hollow-skateboard-trucks">Toucan Pro</a></td></tr></tbody>',
      "</table>",
    ].join(""),
    "en",
  );

  check(
    "wraps product tables once",
    table.match(/class="product-description-table-scroll"/g)?.length === 1,
  );
  includes(
    "gives the table scroll region accessible metadata",
    table,
    'role="region" aria-label="Scrollable product specifications" tabindex="0"',
  );
  check(
    "keeps the table inside its scroll region",
    table.indexOf("product-description-table-scroll") < table.indexOf("<table"),
  );
  includes(
    "rewrites product links inside table cells",
    table,
    'href="/products/double-hollow-skateboard-trucks"',
  );

  const plain = "<p>Plain description with <strong>markup</strong>.</p>";
  check(
    "leaves descriptions without product links or tables unchanged",
    prepareProductDescriptionHtml(plain, "en") === plain,
  );
  check(
    "handles an empty description",
    prepareProductDescriptionHtml("", "en") === "",
  );

  if (failures.length) {
    console.error(`\n${failures.length} product-description test(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n${passed} product-description tests passed.`);
}

run();
