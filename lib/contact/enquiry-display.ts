/**
 * How a stored enquiry is presented in the admin panel.
 *
 * Framework-free and synchronous on purpose, so the admin list and a test script
 * can both use it without a database, a Next runtime, or a browser — the same
 * reasoning as lib/catalog/hero.ts.
 *
 * `answers` and `meta` are unvalidated jsonb: app/api/contact/submit stores
 * whatever the client sent, minus empty values, and nothing enforces a shape at
 * write time. So every function here treats its input as `unknown` and degrades
 * rather than throwing — a row written before a rule changed must never be able
 * to break the list.
 */

import { REASONS, ROUTES, SHARED_FIELDS } from "lib/contact/routes";

export type AnswerFact = {
  key: string;
  label: string;
  value: string;
};

export type EnquiryContact = {
  name: string;
  email: string;
  phone: string;
};

export type EnquiryReasonOption = {
  value: string;
  label: string;
};

/** Keys the routing table doesn't describe sort after the ones it does. */
const UNKNOWN_ORDER = Number.MAX_SAFE_INTEGER;

type LabelEntry = {
  label: string;
  order: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * Labels and form order for everything this reason can have collected: its own
 * qualifying fields, then the shared "your details" block, in that order.
 */
function labelLookup(reason: string): Map<string, LabelEntry> {
  const lookup = new Map<string, LabelEntry>();
  let order = 0;

  for (const field of ROUTES[reason]?.fields ?? []) {
    lookup.set(field.name, { label: field.label, order: order++ });
  }

  for (const field of SHARED_FIELDS) {
    lookup.set(field.name, { label: field.label, order: order++ });
  }

  return lookup;
}

/**
 * Drops everything that carries no information: null, undefined, blank strings,
 * empty arrays, and objects whose entries all prune away. That last case is what
 * stops `meta.utm` — currently written as five nulls — rendering as a noisy
 * `{"source":null,…}` blob.
 */
function prune(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() === "" ? null : value;
  }

  if (Array.isArray(value)) {
    const kept = value
      .map((entry) => prune(entry))
      .filter((entry) => entry !== null);

    return kept.length > 0 ? kept : null;
  }

  if (typeof value === "object") {
    const kept: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      const pruned = prune(entry);

      if (pruned !== null) {
        kept[key] = pruned;
      }
    }

    return Object.keys(kept).length > 0 ? kept : null;
  }

  return value;
}

/**
 * Arrays join for display, scalars stringify, and anything that pruned away is
 * omitted. A surviving object is serialised rather than dropped — it cannot
 * arrive through the form today, but hiding a stored value would be worse than
 * showing it raw.
 */
function format(value: unknown): string | null {
  const pruned = prune(value);

  if (pruned === null) {
    return null;
  }

  if (typeof pruned === "string") {
    return pruned.trim();
  }

  if (Array.isArray(pruned)) {
    const parts = pruned
      .map((entry) => format(entry))
      .filter((part): part is string => part !== null);

    return parts.join(", ");
  }

  if (typeof pruned === "object") {
    return JSON.stringify(pruned);
  }

  return String(pruned);
}

/**
 * Every stored answer, labelled wherever the routing table knows the key.
 *
 * Keys it doesn't describe are appended with the raw key as the label rather
 * than dropped, so a value stored under an unexpected name — or one left behind
 * by an older version of the form — stays visible instead of silently
 * disappearing from the admin's view. Unknown keys are ordered by key because
 * jsonb does not preserve object key order, so insertion order would be
 * arbitrary anyway.
 */
export function describeAnswers(
  reason: string,
  answers: unknown,
): AnswerFact[] {
  const record = asRecord(answers);
  const lookup = labelLookup(reason);

  const facts: (AnswerFact & { order: number })[] = [];

  for (const [key, raw] of Object.entries(record)) {
    const value = format(raw);

    if (value === null) {
      continue;
    }

    facts.push({
      key,
      label: lookup.get(key)?.label ?? key,
      value,
      order: lookup.get(key)?.order ?? UNKNOWN_ORDER,
    });
  }

  return facts
    .sort((a, b) => a.order - b.order || a.key.localeCompare(b.key))
    .map(({ key, label, value }) => ({ key, label, value }));
}

/** The provenance fields, declared in the order they read best. */
const META_LABELS = [
  ["submittedAt", "Submitted at"],
  ["sourcePage", "Source page"],
  ["referrer", "Referrer"],
  ["language", "Language"],
  ["secondsOnForm", "Seconds on form"],
  ["utm", "Campaign"],
] as const;

const META_LABEL_LOOKUP = new Map<string, LabelEntry>(
  META_LABELS.map(([key, label], index) => [key, { label, order: index }]),
);

/**
 * Where the submission came from — the page, referrer, language and campaign it
 * was sent with. Treated as `unknown` exactly like answers, so a meta blob
 * written by an older or newer client can only lose fields, never throw.
 */
export function describeMeta(meta: unknown): AnswerFact[] {
  const record = asRecord(meta);

  const facts: (AnswerFact & { order: number })[] = [];

  for (const [key, raw] of Object.entries(record)) {
    const value = format(raw);

    if (value === null) {
      continue;
    }

    const known = META_LABEL_LOOKUP.get(key);

    facts.push({
      key,
      label: known?.label ?? key,
      value,
      order: known?.order ?? UNKNOWN_ORDER,
    });
  }

  return facts
    .sort((a, b) => a.order - b.order || a.key.localeCompare(b.key))
    .map(({ key, label, value }) => ({ key, label, value }));
}

/**
 * Who to reply to. Returns empty strings rather than undefined so the table can
 * render a blank cell without branching, and never throws on a malformed blob.
 */
export function summariseEnquiry(answers: unknown): EnquiryContact {
  const record = asRecord(answers);

  const name = [format(record.firstName), format(record.lastName)]
    .filter((part): part is string => part !== null)
    .join(" ");

  return {
    name,
    email: format(record.email) ?? "",
    phone: format(record.phone) ?? "",
  };
}

/**
 * The reason filter's options, derived from the routing table rather than
 * duplicated, so a reason added there appears here with no edit. The empty value
 * is the "no filter" sentinel the page treats as absent.
 */
export const ENQUIRY_REASON_FILTER_OPTIONS: readonly EnquiryReasonOption[] = [
  { value: "", label: "All reasons" },
  ...REASONS.flatMap((group) =>
    group.options.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ),
];

/**
 * Narrows an unknown value to a reason key that actually exists.
 *
 * The reason arrives from the query string, so it is user-controlled: this
 * validates it instead of casting it, and `hasOwnProperty` rather than `in` so
 * inherited keys ("constructor", "__proto__") can't pass the check.
 */
export function isKnownReason(value: unknown): value is string {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(ROUTES, value)
  );
}
