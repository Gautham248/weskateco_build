/**
 * Read-only. Reproduces exactly what the configurator cards will render, so
 * "duplicate entries" can be confirmed as identical-looking cards rather than
 * guessed at.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require_ = createRequire(import.meta.url);

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const qf = readFileSync("lib/shopify/queries/configurator.ts", "utf8");
const query = qf.slice(qf.indexOf("`") + 1, qf.lastIndexOf("`"));

const res = await fetch(
  `https://${(env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "")}/api/2025-07/graphql.json`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables: { first: 100 } }),
  },
);
const json: any = await res.json();
if (json.errors) {
  console.log("errors", json.errors);
  process.exit(1);
}

const nodes = json.data.products.edges.map((e: any) => e.node);
// Same reshape the app performs.
const products = nodes.map((n: any) => ({
  ...n,
  variants: n.variants.edges.map((e: any) => e.node),
}));

const { buildConfiguratorItems } = require_(
  "./lib/configurator/mock-data.ts",
);
const engine = require_("./lib/configurator/engine.ts");

const catalog = buildConfiguratorItems(products as any);

// Mirror components/configurator/product-card.tsx getSubtitle()
function subtitle(item: any): string {
  const meta = item.meta;
  switch (meta.category) {
    case "deck": {
      const w = meta.deck_width;
      return w !== undefined ? `${w}" width — ${item.variantTitle}` : item.variantTitle;
    }
    case "truck": {
      if (meta.truck_hanger_size) {
        return `${meta.truck_hanger_size}" hanger — ${meta.truck_sold_as}`;
      }
      return `${meta.truck_sold_as} — ${meta.truck_type}`;
    }
    case "wheel":
      return `${meta.wheel_diameter}mm — ${meta.wheel_hardness}`;
    case "bearing":
      return item.variantTitle !== "Default Title" ? item.variantTitle : meta.bearing_type;
    case "griptape":
      return item.variantTitle !== "Default Title"
        ? item.variantTitle
        : `${meta.grip_width}" width`;
    default:
      return item.variantTitle;
  }
}

for (const boardType of ["Skateboard", "Surfskate"]) {
  const trucks = engine.getCompatibleTrucks(catalog.trucks, boardType);
  const wheels = engine.getCompatibleWheels(catalog.wheels, boardType);

  console.log(`\n############ boardType = ${boardType} ############`);

  for (const [label, list] of [
    ["TRUCKS", trucks.compatible],
    ["WHEELS", wheels.compatible],
  ] as const) {
    console.log(`\n--- ${label}: ${list.length} card(s) ---`);
    for (const it of list) {
      console.log(
        `  "${it.productTitle}" | variant="${it.variantTitle}" | subtitle="${subtitle(it)}"`,
      );
    }

    // Collapse key = what the user actually sees on the card.
    const groups = new Map<string, any[]>();
    for (const it of list) {
      const k = `${it.productTitle}::${subtitle(it)}`;
      groups.set(k, [...(groups.get(k) ?? []), it]);
    }
    const dups = [...groups.entries()].filter(([, v]) => v.length > 1);
    if (dups.length) {
      console.log(`  *** ${dups.length} VISUALLY IDENTICAL GROUP(S):`);
      for (const [k, v] of dups) {
        console.log(`      "${k}"  x${v.length}`);
        console.log(
          `        variantIds: ${v.map((i) => i.variantId).join(", ")}`,
        );
        console.log(
          `        variantTitles: ${v.map((i) => JSON.stringify(i.variantTitle)).join(", ")}`,
        );
      }
    } else {
      console.log(`  no visually identical cards`);
    }
  }
}

// Which mock handles are absent from the feed entirely?
console.log("\n\n============ MOCK HANDLES NOT IN FEED ============");
const feedHandles = new Set(nodes.map((n: any) => n.handle as string));
const mock = JSON.parse(readFileSync("config/mock-configurator-data.json", "utf8"));
for (const cat of ["decks", "trucks", "wheels", "bearings", "griptape"] as const) {
  for (const h of Object.keys(mock[cat] ?? {})) {
    if (!feedHandles.has(h)) {
      console.log(`  MISSING  ${cat}/${h}`);
    }
  }
}
console.log("\n  feed handles containing 'wheel' or 'truck':");
for (const h of [...feedHandles].sort()) {
  if (/wheel|truck/i.test(h)) console.log(`     ${h}`);
}
