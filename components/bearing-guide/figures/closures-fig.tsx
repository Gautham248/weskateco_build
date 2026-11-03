"use client";

import { useId, type SVGProps } from "react";
import "./figure-styles.css";

export function ClosuresFig(props: SVGProps<SVGSVGElement>) {
  const rawId = useId().replace(/:/g, "");
  const dtaId = `dta-${rawId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 614 232"
      role="img"
      aria-label="Three closures drawn at the same magnification: a metal shield leaving a gap at the inner race, a rubber seal whose lip touches it, and a labyrinth seal sitting in a groove so dirt has to turn corners."
      {...props}
      className={`bfig sealfig bearing-fig-root ${props.className ?? ""}`}
    >
      <defs>
        <marker
          id={dtaId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
        </marker>
      </defs>
      <g transform="translate(0.0 0)">
        <text className="pnl" x="0" y="26">
          Metal shield
        </text>
        <rect className="st" x="34.5" y="52.0" width="105.0" height="16.8" />
        <rect className="st" x="34.5" y="140.2" width="105.0" height="16.8" />
        <circle className="ball" cx="87.0" cy="104.5" r="35.7" />
        <rect className="cl" x="42.8" y="68.8" width="5.1" height="66.3" />
        <g transform="translate(174.0 0) scale(-1 1)">
          <rect className="cl" x="42.8" y="68.8" width="5.1" height="66.3" />
        </g>
        <path
          className="dirt"
          d="M12.8 135.7 L56.9 135.7 L56.9 113.5"
          markerEnd={`url(#${dtaId})`}
        />
        <text className="cnote" x="0" y="186.0">
          A gap it never closes
        </text>
      </g>
      <g transform="translate(214.0 0)">
        <text className="pnl" x="0" y="26">
          Rubber seal
        </text>
        <rect className="st" x="34.5" y="52.0" width="105.0" height="16.8" />
        <rect className="st" x="34.5" y="140.2" width="105.0" height="16.8" />
        <circle className="ball" cx="87.0" cy="104.5" r="35.7" />
        <rect className="cl rub" x="42.8" y="68.8" width="5.1" height="71.4" />
        <path className="cl rub" d="M42.8 140.2 L56.9 140.2 L47.9 132.0 Z" />
        <g transform="translate(174.0 0) scale(-1 1)">
          <rect
            className="cl rub"
            x="42.8"
            y="68.8"
            width="5.1"
            height="71.4"
          />
          <path className="cl rub" d="M42.8 140.2 L56.9 140.2 L47.9 132.0 Z" />
        </g>
        <path
          className="dirt"
          d="M12.8 135.7 L38.8 135.7"
          markerEnd={`url(#${dtaId})`}
        />
        <text className="cnote" x="0" y="186.0">
          A lip that presses on the race
        </text>
      </g>
      <g transform="translate(428.0 0)">
        <text className="pnl" x="0" y="26">
          Labyrinth
        </text>
        <rect className="st" x="34.5" y="52.0" width="105.0" height="16.8" />
        <rect className="st" x="34.5" y="140.2" width="105.0" height="16.8" />
        <circle className="ball" cx="87.0" cy="104.5" r="35.7" />
        <rect className="grv" x="38.0" y="140.2" width="14.7" height="9.3" />
        <rect className="cl" x="42.8" y="68.8" width="5.1" height="78.9" />
        <g transform="translate(174.0 0) scale(-1 1)">
          <rect className="grv" x="38.0" y="140.2" width="14.7" height="9.3" />
          <rect className="cl" x="42.8" y="68.8" width="5.1" height="78.9" />
        </g>
        <path
          className="dirt"
          d="M12.8 135.7 L35.0 135.7 L35.0 146.2 L55.6 146.2 L55.6 113.5"
          markerEnd={`url(#${dtaId})`}
        />
        <text className="cnote" x="0" y="186.0">
          No contact, and three corners
        </text>
      </g>
      <text className="foot" x="0" y="220">
        Pink is how far dirt has to travel to reach the ball. One magnification
        across all three.
      </text>
    </svg>
  );
}
