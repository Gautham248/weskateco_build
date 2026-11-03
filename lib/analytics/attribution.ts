import type { CartAttribute } from "lib/shopify/types";

/**
 * Browser identifiers saved on the Shopify cart as hidden attributes (keys
 * starting with "_" aren't shown to customers). They flow into the order's
 * note_attributes, so the orders/create webhook can attribute the purchase
 * to the same GA4 user/session, Google Ads click and Meta browser.
 */
export const ATTRIBUTION_KEYS = {
  gaClientId: "_ga_client_id",
  gaSessionId: "_ga_session_id",
  gclid: "_gclid",
  fbp: "_fbp",
  fbc: "_fbc",
} as const;

export type Attribution = Partial<
  Record<keyof typeof ATTRIBUTION_KEYS, string>
>;

type CookieReader = { get(name: string): { value: string } | undefined };

// _ga = "GA1.1.123456789.1700000000" -> "123456789.1700000000"
function parseGaClientId(value: string | undefined): string | undefined {
  const parts = value?.split(".");
  if (!parts || parts.length < 4) return undefined;
  return parts.slice(-2).join(".");
}

// _ga_<ID> = "GS1.1.1700000000.3.1..." or "GS2.1.s1700000000$o3$g1..."
function parseGaSessionId(value: string | undefined): string | undefined {
  const field = value?.split(".")[2];
  if (!field) return undefined;
  const id = field.startsWith("s") ? field.slice(1).split("$")[0] : field;
  return id && /^\d+$/.test(id) ? id : undefined;
}

// _gcl_aw = "GCL.1700000000.<gclid>"
function parseGclid(value: string | undefined): string | undefined {
  const parts = value?.split(".");
  if (!parts || parts.length < 3) return undefined;
  return parts.slice(2).join(".");
}

export function attributionFromCookies(
  cookies: CookieReader,
  gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
): CartAttribute[] {
  const sessionCookie = gaMeasurementId
    ? `_ga_${gaMeasurementId.replace(/^G-/, "")}`
    : undefined;

  const values: Attribution = {
    gaClientId: parseGaClientId(cookies.get("_ga")?.value),
    gaSessionId: sessionCookie
      ? parseGaSessionId(cookies.get(sessionCookie)?.value)
      : undefined,
    gclid: parseGclid(cookies.get("_gcl_aw")?.value),
    fbp: cookies.get("_fbp")?.value,
    fbc: cookies.get("_fbc")?.value,
  };

  return Object.entries(values)
    .filter((entry): entry is [keyof Attribution, string] => !!entry[1])
    .map(([name, value]) => ({ key: ATTRIBUTION_KEYS[name], value }));
}

export function attributionFromNoteAttributes(
  noteAttributes: { name: string; value: string }[] | undefined,
): Attribution {
  const byKey = new Map(noteAttributes?.map((a) => [a.name, a.value]));
  const result: Attribution = {};
  for (const [name, key] of Object.entries(ATTRIBUTION_KEYS)) {
    const value = byKey.get(key);
    if (value) result[name as keyof Attribution] = value;
  }
  return result;
}
