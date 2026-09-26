import { productReadState } from "lib/catalog/product-page";
import type { Product } from "lib/shopify/types";

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

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

const PRODUCT = {
  handle: "sphere-heavy-griptape",
  title: "Sphere Heavy Griptape",
} as unknown as Product;

function main() {
  console.log("\nproductReadState");

  equal(
    "a read that could not be performed is 'unavailable'",
    productReadState({ status: "failed" }),
    { kind: "unavailable" },
  );

  // The rule this module exists for. Everything else here is plumbing around it.
  check(
    "a failed read is NEVER reported as a missing product",
    productReadState({ status: "failed" }).kind !== "missing",
    "a fetch failure routed into notFound() would tell customers and crawlers that a real product does not exist",
  );

  check(
    "a failed read is never reported as a successful one either",
    productReadState({ status: "failed" }).kind !== "ok",
  );

  equal(
    "a read that found the product is 'ok'",
    productReadState({ status: "ok", product: PRODUCT }),
    { kind: "ok", product: PRODUCT },
  );

  check(
    "the found product is carried through, not rebuilt",
    (() => {
      const state = productReadState({ status: "ok", product: PRODUCT });

      return state.kind === "ok" && state.product === PRODUCT;
    })(),
  );

  equal(
    "a read that succeeded with no product is 'missing'",
    productReadState({ status: "ok", product: undefined }),
    { kind: "missing" },
  );

  check(
    "only the three known kinds are ever produced",
    (
      [
        { status: "failed" },
        { status: "ok", product: PRODUCT },
        { status: "ok", product: undefined },
      ] as const
    ).every((result) =>
      ["ok", "missing", "unavailable"].includes(productReadState(result).kind),
    ),
  );

  check(
    "an unreadable catalogue is distinct from an empty one",
    productReadState({ status: "failed" }).kind !==
      productReadState({ status: "ok", product: undefined }).kind,
    "collapsing these is what turns an outage into a 404",
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main();
