"use client";

import type { SVGProps } from "react";
import "./figure-styles.css";

export function AbecToleranceFig(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 378"
      role="img"
      aria-label="Two panels. The first is a revolutions-per-minute axis showing that all of skateboarding sits below 4700 rpm while ABEC grades are written for tools turning 20 to 30 thousand. The second draws the five ABEC runout tolerances beside a human hair at one scale, where all five are slivers."
      {...props}
      className={`bfig bearing-fig-root ${props.className ?? ""}`}
    >
      <text className="pnl" x="16" y="34">
        A · The speed ABEC assumes
      </text>
      <line className="axl" x1="74.0" y1="108.0" x2="668.0" y2="108.0" />
      <line className="axl" x1="74.0" y1="108.0" x2="74.0" y2="114.0" />
      <text className="axt" x="74.0" y="128.0" textAnchor="middle">
        0
      </text>
      <line className="axl" x1="173.0" y1="108.0" x2="173.0" y2="114.0" />
      <text className="axt" x="173.0" y="128.0" textAnchor="middle">
        5k
      </text>
      <line className="axl" x1="272.0" y1="108.0" x2="272.0" y2="114.0" />
      <text className="axt" x="272.0" y="128.0" textAnchor="middle">
        10k
      </text>
      <line className="axl" x1="371.0" y1="108.0" x2="371.0" y2="114.0" />
      <text className="axt" x="371.0" y="128.0" textAnchor="middle">
        15k
      </text>
      <line className="axl" x1="470.0" y1="108.0" x2="470.0" y2="114.0" />
      <text className="axt" x="470.0" y="128.0" textAnchor="middle">
        20k
      </text>
      <line className="axl" x1="569.0" y1="108.0" x2="569.0" y2="114.0" />
      <text className="axt" x="569.0" y="128.0" textAnchor="middle">
        25k
      </text>
      <line className="axl" x1="668.0" y1="108.0" x2="668.0" y2="114.0" />
      <text className="axt" x="668.0" y="128.0" textAnchor="middle">
        30k
      </text>
      <rect className="skate" x="74.0" y="82.0" width="39.6" height="26" />
      <line className="mark" x1="167.1" y1="68.0" x2="167.1" y2="108.0" />
      <rect className="indus" x="470.0" y="82.0" width="198.0" height="26" />
      <text className="lab" x="76.0" y="74.0">
        90% of skating
      </text>
      <text className="lab lift" x="174.1" y="62.0">
        4,700 · the fastest a skate wheel turns
      </text>
      <text className="lab" x="472.0" y="74.0">
        What the ABEC grades are for
      </text>
      <line className="sep" x1="16" y1="164" x2="704" y2="164" />
      <text className="pnl" x="16" y="192">
        B · The size ABEC controls
      </text>
      <text className="rname" x="198.0" y="226.0" textAnchor="end">
        A human hair
      </text>
      <rect className="hair" x="210.0" y="214.0" width="290.50" height="15.0" />
      <text className="rval" x="509.5" y="226.0">
        about 70 µm
      </text>
      <text className="rname" x="198.0" y="249.0" textAnchor="end">
        ABEC 1
      </text>
      <rect className="tol" x="210.0" y="237.0" width="41.50" height="15.0" />
      <text className="rval" x="260.5" y="249.0">
        10 µm
      </text>
      <text className="rname" x="198.0" y="272.0" textAnchor="end">
        ABEC 3
      </text>
      <rect className="tol" x="210.0" y="260.0" width="29.05" height="15.0" />
      <text className="rval" x="248.1" y="272.0">
        7 µm
      </text>
      <text className="rname" x="198.0" y="295.0" textAnchor="end">
        ABEC 5
      </text>
      <rect className="tol" x="210.0" y="283.0" width="16.60" height="15.0" />
      <text className="rval" x="235.6" y="295.0">
        4 µm
      </text>
      <text className="rname" x="198.0" y="318.0" textAnchor="end">
        ABEC 7
      </text>
      <rect className="tol" x="210.0" y="306.0" width="10.38" height="15.0" />
      <text className="rval" x="229.4" y="318.0">
        2.5 µm
      </text>
      <text className="rname" x="198.0" y="341.0" textAnchor="end">
        ABEC 9
      </text>
      <rect className="tol" x="210.0" y="329.0" width="6.23" height="15.0" />
      <text className="rval" x="225.2" y="341.0">
        1.5 µm
      </text>
      <text className="foot" x="198.0" y="364.0" textAnchor="end">
        One scale
      </text>
      <line className="axl" x1="210.0" y1="359.0" x2="500.5" y2="359.0" />
      <text className="foot" x="509.5" y="364.0">
        Runout, for a bore of 1 to 18 mm
      </text>
    </svg>
  );
}
