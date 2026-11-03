#!/usr/bin/env node
// refactor/scripts/snapshot.mjs
//
// Visual-output regression check WITHOUT a browser: captures the rendered HTML of
// a fixed route list, normalizes build noise, and diffs two captures.
//
//   node refactor/scripts/snapshot.mjs capture --base http://localhost:3000 --out refactor/snapshots/before [--cookie "admin_session=..."]
//   node refactor/scripts/snapshot.mjs compare refactor/snapshots/before refactor/snapshots/after
//
// What is compared per route: HTTP status + final path, <title>, every <meta>,
// canonical/alternate <link>, JSON-LD blocks, and the <body> markup with every
// <script> removed and build-hashed asset URLs neutralised.
// Screenshots (pixel checks) are a separate, optional layer: see Phase 0 step 0.5.
//
// Determinism note: live Shopify data changes. Capture "before" and "after" in the
// same sitting, against the same store, or pin the store data.

import fs from "node:fs";
import path from "node:path";

const [, , cmd, ...rest] = process.argv;
const arg = (n, d) => {
  const i = rest.indexOf(n);
  return i > -1 ? rest[i + 1] : d;
};
const routes = JSON.parse(
  fs.readFileSync("refactor/snapshot-routes.json", "utf8"),
);

function normalize(html) {
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) ?? [, ""])[1];
  const bodyM = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = (bodyM ? bodyM[0] : html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/*")
    .replace(/[?&]dpl=[\w-]+/g, "")
    .replace(/\snonce="[^"]*"/g, "")
    .replace(/\sdata-precedence="[^"]*"/g, "")
    .replace(
      /<!--\$-->|<!--\/\$-->|<!--\$\?-->|<template[^>]*><\/template>/g,
      "",
    )
    .replace(/>\s*</g, ">\n<")
    .trim();
  const metas = [...head.matchAll(/<meta\s[^>]*>/gi)]
    .map((m) => m[0].replace(/\s+/g, " "))
    .sort();
  const links = [
    ...head.matchAll(/<link\s[^>]*rel="(canonical|alternate)"[^>]*>/gi),
  ]
    .map((m) => m[0].replace(/\s+/g, " "))
    .sort();
  const title = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [, ""])[1];
  const ld = [
    ...html.matchAll(
      /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1].trim());
  return { title, metas, links, ld, body };
}

const slug = (r) =>
  r === "/" ? "_root" : r.replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "");

if (cmd === "capture") {
  const base = arg("--base", "http://localhost:3000");
  const out = arg("--out");
  const cookie = arg("--cookie");
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const r of routes) {
    const res = await fetch(base + r, {
      redirect: "follow",
      headers: cookie && r.startsWith("/admin") ? { cookie } : {},
    });
    const html = await res.text();
    const rec = {
      route: r,
      status: res.status,
      finalPath: new URL(res.url).pathname,
      ...normalize(html),
    };
    fs.writeFileSync(
      path.join(out, slug(r) + ".json"),
      JSON.stringify(rec, null, 1),
    );
    console.log(`${String(res.status).padEnd(4)} ${r}`);
    n += 1;
  }
  console.log(`\ncaptured ${n} routes -> ${out}`);
} else if (cmd === "compare") {
  const [a, b] = rest;
  const files = fs.readdirSync(a).filter((f) => f.endsWith(".json"));
  let diffs = 0;
  for (const f of files) {
    const pa = path.join(a, f),
      pb = path.join(b, f);
    if (!fs.existsSync(pb)) {
      console.log(`  FAIL  ${f}: missing in ${b}`);
      diffs += 1;
      continue;
    }
    const ja = JSON.parse(fs.readFileSync(pa, "utf8")),
      jb = JSON.parse(fs.readFileSync(pb, "utf8"));
    if (JSON.stringify(ja) === JSON.stringify(jb)) continue;
    diffs += 1;
    const flat = (o) =>
      [
        o.status,
        o.finalPath,
        o.title,
        ...(o.metas ?? []),
        ...(o.links ?? []),
        ...(o.ld ?? []),
        ...(o.body ?? o.text ?? "").split("\n"),
      ].map(String);
    const la = flat(ja),
      lb = flat(jb);
    const i = la.findIndex((x, k) => x !== lb[k]);
    const cut = (x) => (x ?? "<end>").slice(0, 200);
    console.log(
      `  FAIL  ${ja.route}  (first differing line #${i})\n        - ${cut(la[i])}\n        + ${cut(lb[i])}`,
    );
  }
  console.log(
    diffs
      ? `\nSnapshot: ${diffs} route(s) differ`
      : `\nSnapshot: identical across ${files.length} routes`,
  );
  process.exit(diffs ? 1 : 0);
} else {
  console.error("usage: snapshot.mjs <capture|compare> ...");
  process.exit(2);
}
