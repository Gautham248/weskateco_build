// ---------------------------------------------------------------------------
// Shared table primitives for the guide pages. These were previously
// duplicated in lib/deck-guide/data.ts, lib/truck-guide/data.ts and
// lib/griptape-guide/data.ts; the union of all three variants lives here.
//   - `span` merges a cell across columns (griptape guide)
//   - `warn` tints a cell amber with a dot (truck guide)
//   - `warnRow` tints a whole row amber (truck guide)
// ---------------------------------------------------------------------------

export type TableCell =
  | string
  | { text: string; warn?: boolean; muted?: boolean; span?: number };

export interface TableCol {
  name: string;
  sub: string;
}

export interface TableRow {
  label: string;
  note?: string;
  cells: TableCell[];
  warnRow?: boolean;
}

/** FAQ item shared by every guide's FAQ list (was duplicated as
 *  FaqItem / DeckFaqItem / TruckFaqItem / WheelFaqItem / GripFaqItem). */
export interface GuideFaqItem {
  q: string;
  a: string;
  stock?: string;
}
