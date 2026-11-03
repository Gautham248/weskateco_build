/**
 * Architecture rules for the WeSkate refactor.
 * Public surface of a module (what other modules / app / components may import):
 *   modules/<m>/domain/**            pure, side-effect-free logic and types
 *   modules/<m>/*.service.ts         use-cases and cached reads
 *   modules/<m>/*.actions.ts         "use server" wrappers
 *   modules/<m>/*.types.ts           shared types
 *   modules/<m>/*.events.ts          domain events (Phase 2 work)
 * Everything else in a module (data/, sources/, *.data.ts, internals) is private.
 */
const PUBLIC =
  "^modules/[^/]+/(domain/.+\\.(ts|json)|[^/]+\\.(service|actions|types|events)\\.ts|actions/[^/]+\\.actions\\.ts)$";

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "No import cycles.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "integrations-are-leaves",
      comment:
        "integrations/ talk to the outside world; they never import app code, modules or UI.",
      severity: "error",
      from: { path: "^integrations/" },
      to: { path: "^(modules|app|components)/" },
    },
    {
      name: "platform-is-below-modules",
      comment:
        "platform/ holds cross-cutting infrastructure; it never depends on feature modules or UI.",
      severity: "error",
      from: { path: "^platform/" },
      to: { path: "^(modules|app|components)/" },
    },
    {
      name: "modules-never-import-ui",
      severity: "error",
      from: { path: "^modules/" },
      to: { path: "^(app|components)/" },
    },
    {
      name: "modules-only-cross-public-surface",
      comment:
        "A module may import another module only through its public surface.",
      severity: "error",
      from: { path: "^modules/([^/]+)/" },
      to: { path: "^modules/[^/]+/", pathNot: ["^modules/$1/", PUBLIC] },
    },
    {
      name: "ui-only-imports-public-surface",
      comment:
        "app/ and components/ import modules only through the public surface, never integrations or the DB.",
      severity: "error",
      from: { path: "^(app|components)/" },
      to: { path: "^modules/[^/]+/", pathNot: PUBLIC },
    },
    {
      name: "components-never-import-integrations-or-db",
      severity: "error",
      from: { path: "^components/" },
      to: { path: "^(integrations/|lib/db/|platform/)" },
    },
    {
      name: "lib-is-a-kernel",
      comment:
        "lib/ is shared, dependency-free support code. Only lib/db may pull in *.schema.ts files.",
      severity: "error",
      from: {
        path: "^lib/",
        pathNot: "^lib/(shopify/index|admin/(actions|queries|auth))\\.ts$",
      },
      to: {
        path: "^(modules|integrations|platform)/",
        pathNot: "\\.schema\\.ts$",
      },
    },
    {
      name: "schema-files-are-pure",
      comment:
        "*.schema.ts may import only drizzle-orm and other *.schema.ts files.",
      severity: "error",
      from: { path: "\\.schema\\.ts$" },
      to: {
        pathNot: "\\.schema\\.ts$",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
    {
      name: "domain-is-pure",
      comment:
        "modules/*/domain must not touch the database, the network, Next.js request APIs or integrations.",
      severity: "error",
      from: { path: "^modules/[^/]+/domain/" },
      to: {
        path: [
          "^lib/db/",
          "^integrations/",
          "^platform/",
          "\\.data\\.ts$",
          "\\.service\\.ts$",
        ],
        pathNot: "^modules/[^/]+/domain/",
      },
    },
    {
      name: "data-access-is-private-to-its-module",
      severity: "error",
      from: { path: "^(app|components)/" },
      to: { path: "\\.data\\.ts$" },
    },
  ],
  options: {
    tsConfig: { fileName: "tsconfig.json" },
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)(\\.next|node_modules|scripts|sanity|refactor)/" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
  },
};
