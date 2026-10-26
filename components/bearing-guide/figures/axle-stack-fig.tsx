"use client";

import { useId, type SVGProps } from "react";
import "./figure-styles.css";

export interface AxleStackFigProps extends SVGProps<SVGSVGElement> {
  mode: "with" | "without";
}

export function AxleStackFig({ mode, ...props }: AxleStackFigProps) {
  const rawId = useId().replace(/:/g, "");
  const lpaId = `lpa-${rawId}`;
  const huId = `hu-${rawId}`;
  const hhId = `hh-${rawId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 374"
      role="img"
      aria-label="A section through a skateboard wheel on its axle, showing in order the hanger, a speed washer, a bearing, the spacer, the second bearing, a second speed washer and the axle nut, with the path the nut's clamping force takes drawn through them."
      {...props}
      className={`bfig stackfig bearing-fig-root ${props.className ?? ""}`}
    >
      <defs>
        <marker
          id={lpaId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
        </marker>
        <pattern
          id={huId}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity=".38"
          />
        </pattern>
        <pattern
          id={hhId}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity=".5"
          />
        </pattern>
      </defs>
      <rect className="ure" x="88.0" y="48.0" width="210.0" height="54.0" />
      <rect className="ure" x="88.0" y="234.0" width="210.0" height="54.0" />
      <rect
        className="hatch"
        x="88.0"
        y="48.0"
        width="210.0"
        height="54.0"
        fill={`url(#${huId})`}
        stroke="none"
      />
      <rect
        className="hatch"
        x="88.0"
        y="234.0"
        width="210.0"
        height="54.0"
        fill={`url(#${huId})`}
        stroke="none"
      />
      <rect className="core" x="88.0" y="102.0" width="210.0" height="1.0" />
      <rect className="core" x="88.0" y="233.0" width="210.0" height="1.0" />
      <rect className="hang" x="26.0" y="48.0" width="62.0" height="240.0" />
      <rect
        x="26.0"
        y="48.0"
        width="62.0"
        height="240.0"
        fill={`url(#${hhId})`}
        stroke="none"
      />
      <rect className="axle" x="26.0" y="144.0" width="320.0" height="48.0" />
      <rect className="wsh" x="88.0" y="130.8" width="6.0" height="13.2" />
      <rect className="wsh" x="88.0" y="192.0" width="6.0" height="13.2" />
      <g className="brg">
        <rect className="cav" x="94.0" y="108.7" width="42.0" height="28.6" />
        <rect className="cav" x="94.0" y="198.7" width="42.0" height="28.6" />
        <rect className="st" x="94.0" y="102.0" width="42.0" height="6.7" />
        <rect className="st" x="94.0" y="227.3" width="42.0" height="6.7" />
        <rect className="st" x="94.0" y="137.3" width="42.0" height="6.7" />
        <rect className="st" x="94.0" y="192.0" width="42.0" height="6.7" />
        <circle className="ball" cx="115.0" cy="123.0" r="14.3" />
        <rect className="shd" x="96.4" y="111.6" width="2.1" height="24.0" />
        <rect className="shd" x="131.5" y="111.6" width="2.1" height="24.0" />
        <circle className="ball" cx="115.0" cy="213.0" r="14.3" />
        <rect className="shd" x="96.4" y="200.4" width="2.1" height="24.0" />
        <rect className="shd" x="131.5" y="200.4" width="2.1" height="24.0" />
      </g>
      {mode === "with" && (
        <g className="spgrp">
          <rect
            className="spc"
            x="136.0"
            y="136.8"
            width="114.0"
            height="7.2"
          />
          <rect
            className="spc"
            x="136.0"
            y="192.0"
            width="114.0"
            height="7.2"
          />
        </g>
      )}
      <g className="brg">
        <rect className="cav" x="250.0" y="108.7" width="42.0" height="28.6" />
        <rect className="cav" x="250.0" y="198.7" width="42.0" height="28.6" />
        <rect className="st" x="250.0" y="102.0" width="42.0" height="6.7" />
        <rect className="st" x="250.0" y="227.3" width="42.0" height="6.7" />
        <rect className="st" x="250.0" y="137.3" width="42.0" height="6.7" />
        <rect className="st" x="250.0" y="192.0" width="42.0" height="6.7" />
        <circle className="ball" cx="271.0" cy="123.0" r="14.3" />
        <rect className="shd" x="252.4" y="111.6" width="2.1" height="24.0" />
        <rect className="shd" x="287.5" y="111.6" width="2.1" height="24.0" />
        <circle className="ball" cx="271.0" cy="213.0" r="14.3" />
        <rect className="shd" x="252.4" y="200.4" width="2.1" height="24.0" />
        <rect className="shd" x="287.5" y="200.4" width="2.1" height="24.0" />
      </g>
      <rect className="wsh" x="292.0" y="130.8" width="6.0" height="13.2" />
      <rect className="wsh" x="292.0" y="192.0" width="6.0" height="13.2" />
      <rect
        className="nut"
        x="298.0"
        y="126.0"
        width="36.0"
        height="84.0"
        rx="2"
      />
      <path
        className="brk"
        d="M22.0 48.0 L35.0 53.0 L48.0 43.0 L61.0 53.0 L74.0 43.0 L87.0 53.0 L100.0 43.0 L113.0 53.0 L126.0 43.0 L139.0 53.0 L152.0 43.0 L165.0 53.0 L178.0 43.0 L191.0 53.0 L204.0 43.0 L217.0 53.0 L230.0 43.0 L243.0 53.0 L256.0 43.0 L269.0 53.0 L282.0 43.0 L295.0 53.0 L308.0 43.0 L321.0 53.0 L334.0 43.0 L347.0 53.0 L360.0 43.0"
      />
      <path
        className="brk"
        d="M22.0 288.0 L35.0 293.0 L48.0 283.0 L61.0 293.0 L74.0 283.0 L87.0 293.0 L100.0 283.0 L113.0 293.0 L126.0 283.0 L139.0 293.0 L152.0 283.0 L165.0 293.0 L178.0 283.0 L191.0 293.0 L204.0 283.0 L217.0 293.0 L230.0 283.0 L243.0 293.0 L256.0 283.0 L269.0 293.0 L282.0 283.0 L295.0 293.0 L308.0 283.0 L321.0 293.0 L334.0 283.0 L347.0 293.0 L360.0 283.0"
      />
      <line className="axis" x1="16.0" y1="168.0" x2="360.0" y2="168.0" />
      {mode === "with" && (
        <g className="lp lp-with">
          <path
            className="lpline ok arrows"
            d="M300.0 195.4 L86.0 195.4"
            markerStart={`url(#${lpaId})`}
            markerEnd={`url(#${lpaId})`}
          />
        </g>
      )}
      {mode === "without" && (
        <g className="lp lp-without">
          <path
            className="lpline bad arrows"
            d="M300.0 195.4 L271.0 195.4 L271.0 230.6 L115.0 230.6 L115.0 195.4 L86.0 195.4"
            markerStart={`url(#${lpaId})`}
            markerEnd={`url(#${lpaId})`}
          />
          <circle className="pinch" cx="115.0" cy="213.0" r="17.8" />
          <circle className="pinch" cx="271.0" cy="213.0" r="17.8" />
        </g>
      )}
      <line className="lead2" x1="57.0" y1="296.0" x2="48.0" y2="316.0" />
      <g className="badge">
        <circle cx="48.0" cy="328.0" r="10.5" />
        <text x="48.0" y="332.0" textAnchor="middle">
          1
        </text>
      </g>
      <line className="lead2" x1="91.0" y1="296.0" x2="92.0" y2="316.0" />
      <g className="badge">
        <circle cx="92.0" cy="328.0" r="10.5" />
        <text x="92.0" y="332.0" textAnchor="middle">
          2
        </text>
      </g>
      <line className="lead2" x1="115.0" y1="296.0" x2="136.0" y2="316.0" />
      <g className="badge">
        <circle cx="136.0" cy="328.0" r="10.5" />
        <text x="136.0" y="332.0" textAnchor="middle">
          3
        </text>
      </g>
      <line className="lead2" x1="193.0" y1="296.0" x2="180.0" y2="316.0" />
      <g className="badge">
        <circle cx="180.0" cy="328.0" r="10.5" />
        <text x="180.0" y="332.0" textAnchor="middle">
          4
        </text>
      </g>
      <line className="lead2" x1="271.0" y1="296.0" x2="224.0" y2="316.0" />
      <g className="badge">
        <circle cx="224.0" cy="328.0" r="10.5" />
        <text x="224.0" y="332.0" textAnchor="middle">
          5
        </text>
      </g>
      <line className="lead2" x1="295.0" y1="296.0" x2="268.0" y2="316.0" />
      <g className="badge">
        <circle cx="268.0" cy="328.0" r="10.5" />
        <text x="268.0" y="332.0" textAnchor="middle">
          6
        </text>
      </g>
      <line className="lead2" x1="316.0" y1="296.0" x2="312.0" y2="316.0" />
      <g className="badge">
        <circle cx="312.0" cy="328.0" r="10.5" />
        <text x="312.0" y="332.0" textAnchor="middle">
          7
        </text>
      </g>
      <text className="orderline" x="26.0" y="360">
        1 Hanger · 2 Speed washer · 3 Bearing · 4 Spacer · 5 Bearing · 6 Speed
        washer · 7 Axle nut
      </text>
      <text className="vcap" x="26.0" y="32.0">
        Section through one wheel · the rest of the urethane is cut off
      </text>
    </svg>
  );
}
