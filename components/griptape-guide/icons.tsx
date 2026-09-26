/**
 * Line-art step icons for the apply stepper — one consistent house-style
 * set (black stroke, rounded, 48×48), drawn to match the reference of the
 * provided clean-the-deck illustration.
 */

const BASE = {
  width: 48,
  height: 48,
  viewBox: "0 0 48 48",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Deck({ stroke = "#000000" }: { stroke?: string }) {
  return (
    <rect
      x="4"
      y="17"
      width="40"
      height="14"
      rx="7"
      stroke={stroke}
      strokeWidth={BASE.strokeWidth}
    />
  );
}

/** Step 1 — clean the deck: deck outline, wipe arrow, dust specks. */
export function CleanDeckIcon() {
  return (
    <svg {...BASE}>
      <Deck />
      <path d="M14 24H32" stroke="#000000" strokeWidth="2.5" />
      <path d="M28 20l4 4-4 4" stroke="#000000" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="1.2" fill="#A1A1AA" />
      <circle cx="27" cy="29" r="1.2" fill="#A1A1AA" />
      <circle cx="34" cy="20" r="1.2" fill="#A1A1AA" />
    </svg>
  );
}

/** Step 2 — peel and lay it on: sheet with peeled corner, drop arrow. */
export function PeelLayIcon() {
  return (
    <svg {...BASE}>
      <path
        d="M10 8h22l6 6v18H10V8z"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 8v6h6" stroke="#000000" strokeWidth="2.5" />
      <path
        d="M24 32v8m0 0l-4-4m4 4l4-4"
        className="stroke-black"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Step 3 — press from the middle out: palm bar, arrows radiating out. */
export function PressOutIcon() {
  return (
    <svg {...BASE}>
      <rect
        x="8"
        y="14"
        width="32"
        height="9"
        rx="4"
        stroke="#000000"
        strokeWidth="2.5"
      />
      <path
        d="M24 30v8m0 0l-3.5-3.5M24 38l3.5-3.5"
        stroke="#000000"
        strokeWidth="2.5"
      />
      <path
        d="M12 34H4m0 0l3-3M4 34l3 3"
        className="stroke-black"
        strokeWidth="2.5"
      />
      <path
        d="M36 34h8m0 0l-3-3m3 3l-3 3"
        className="stroke-black"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Step 4 — score the outline: deck edge with a tool held at an angle. */
export function ScoreOutlineIcon() {
  return (
    <svg {...BASE}>
      <Deck />
      <path d="M30 6L18 30" stroke="#000000" strokeWidth="2.5" />
      <path
        d="M18 30l-3 6 6-3"
        className="stroke-black"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M14 24h6" className="stroke-black" strokeWidth="2.5" />
    </svg>
  );
}

/** Step 5 — cut it off: blade under the rail, offcut strip falling away. */
export function CutOffIcon() {
  return (
    <svg {...BASE}>
      <Deck />
      <path d="M34 6v14l-4 4-4-4V6" stroke="#000000" strokeWidth="2.5" />
      <path
        d="M8 38c4-2 8-2 12 0"
        className="stroke-black"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}

/** Step 6 — sand the edge: offcut strip rubbing the edge, motion arcs. */
export function SandEdgeIcon() {
  return (
    <svg {...BASE}>
      <Deck />
      <rect
        x="14"
        y="33"
        width="16"
        height="7"
        rx="3"
        stroke="#000000"
        strokeWidth="2.5"
      />
      <path
        d="M36 34c1.5 1.5 1.5 4 0 5.5"
        className="stroke-black"
        strokeWidth="2.5"
      />
      <path
        d="M41 31c3 3 3 9 0 12"
        className="stroke-black"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Step 7 — find the bolt holes: deck with four holes, pin from below. */
export function BoltHolesIcon() {
  return (
    <svg {...BASE}>
      <Deck />
      <circle cx="16" cy="24" r="2" stroke="#000000" strokeWidth="2.5" />
      <circle cx="32" cy="24" r="2" stroke="#000000" strokeWidth="2.5" />
      <path d="M16 36V31m16 5V31" stroke="#000000" strokeWidth="2.5" />
      <path
        d="M16 44v-6m0 0l-2.5 2.5M16 44l2.5-2.5"
        className="stroke-black"
        strokeWidth="2.5"
      />
      <path
        d="M32 44v-6m0 0l-2.5 2.5M32 44l2.5-2.5"
        className="stroke-black"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export const STEP_ICONS = [
  CleanDeckIcon,
  PeelLayIcon,
  PressOutIcon,
  ScoreOutlineIcon,
  CutOffIcon,
  SandEdgeIcon,
  BoltHolesIcon,
];
