/**
 * Read-only diagnostic. Calls the Storefront GraphQL endpoint directly because
 * getConfiguratorProducts() wraps itself in cacheTag(), which only works inside
 * the Next runtime. Same query, same credentials, nothing written.
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const domain = (env.SHOPIFY_STORE_DOMAIN ?? "").replace(
  /^https?:\/\//,
  "",
);
const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
// The file is `export const x = /* GraphQL */ `...`;` — send only the
// template literal body, not the surrounding TypeScript.
const queryFile = readFileSync(
  "lib/shopify/queries/configurator.ts",
  "utf8",
);
const query = queryFile.slice(
  queryFile.indexOf("`") + 1,
  queryFile.lastIndexOf("`"),
);

const mockData = JSON.parse(
  readFileSync("config/mock-configurator-data.json", "utf8"),
);

const endpoint = `https://${domain}/api/2025-07/graphql.json`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token!,
  },
  body: JSON.stringify({ query, variables: { first: 100 } }),
});

const json: any = await res.json();

if (json.errors) {
  console.log("GraphQL errors:", JSON.stringify(json.errors, null, 2));
  process.exit(1);
}

const products: any[] = json.data.products.edges.map(
  (e: any) => e.node,
);

console.log(`total products fetched: ${products.length}`);

const ids = products.map((p) => p.id);
console.log(
  "duplicate product ids in feed:",
  ids.length - new Set(ids).size,
);
const handles = products.map((p) => p.handle);
console.log(
  "duplicate handles in feed  :",
  handles.length - new Set(handles).size,
);

for (const cat of ["trucks", "wheels"] as const) {
  const mockMap = mockData[cat] ?? {};
  const key =
    cat === "wheels"
      ? "wheel_diameter_by_variant"
      : "truck_hanger_size_by_variant";

  console.log(`\n============ ${cat.toUpperCase()} ============`);
  let dropped = 0;

  for (const product of products) {
    const mock = mockMap[product.handle];
    if (!mock) continue;

    const titles = (product.variants?.edges ?? []).map((e: any) => e.node.title);
    const mapping: Record<string, unknown> = mock[key] ?? {};

    console.log(`\n${product.handle}  (${titles.length} variants)`);
    console.log(`  titles       : ${JSON.stringify(titles)}`);
    console.log(`  mapping keys : ${JSON.stringify(Object.keys(mapping))}`);

    const missed = titles.filter((t: string) => mapping[t] === undefined);
    for (const k of Object.keys(mapping)) {
      if (!titles.includes(k)) {
        console.log(`  ORPHAN mapping key, no such variant: ${JSON.stringify(k)}`);
      }
    }
    if (missed.length) {
      dropped += missed.length;
      console.log(`  *** DROPPED: ${JSON.stringify(missed)}`);
    } else {
      console.log(`  all matched`);
    }

    const dupTitles = titles.filter(
      (t: string, i: number) => titles.indexOf(t) !== i,
    );
    if (dupTitles.length) {
      console.log(`  *** DUPLICATE titles: ${JSON.stringify(dupTitles)}`);
    }
  }
  console.log(`\n>>> ${cat}: ${dropped} variant(s) silently dropped`);
}
