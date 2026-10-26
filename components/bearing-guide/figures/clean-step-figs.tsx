"use client";

import { useId, type SVGProps } from "react";
import "./figure-styles.css";

export interface CleanStepFigProps extends SVGProps<SVGSVGElement> {
  figure: string;
}

export function CleanStepFig({ figure, ...props }: CleanStepFigProps) {
  const rawId = useId().replace(/:/g, "");
  const saId = `sa-${rawId}`;
  const suId = `su-${rawId}`;
  const stem = figure.replace(/^assets\/figures\//, "").replace(/\.svg$/, "");

  if (stem === "clean-01-wheels" || stem === "1") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="A section through the end of a wheel and axle with a socket on the axle nut and an arrow showing it turning off"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <rect
          className="sk-ure"
          x="46.0"
          y="29.1"
          width="140.0"
          height="24.8"
        />
        <rect
          className=""
          x="46.0"
          y="29.1"
          width="140.0"
          height="24.8"
          fill={`url(#${suId})`}
          stroke="none"
        />
        <rect
          className="sk-ure"
          x="46.0"
          y="122.1"
          width="140.0"
          height="24.8"
        />
        <rect
          className=""
          x="46.0"
          y="122.1"
          width="140.0"
          height="24.8"
          fill={`url(#${suId})`}
          stroke="none"
        />
        <path
          className="sk-brk"
          d="M46.0 29.1 L51.0 42.1 L41.0 55.1 L51.0 68.1 L41.0 81.1 L51.0 94.1 L41.0 107.1 L51.0 120.1 L41.0 133.1 L51.0 146.1 L41.0 146.9"
        />
        <rect className="sk-st" x="164.0" y="53.9" width="21.7" height="3.5" />
        <rect className="sk-st" x="164.0" y="72.1" width="21.7" height="3.5" />
        <circle className="sk-ball" cx="174.8" cy="64.8" r="7.4" />
        <rect className="sk-st" x="164.0" y="118.6" width="21.7" height="3.5" />
        <rect className="sk-st" x="164.0" y="100.4" width="21.7" height="3.5" />
        <circle className="sk-ball" cx="174.8" cy="111.2" r="7.4" />
        <rect className="sk-axle" x="14" y="75.6" width="248" height="24.8" />
        <rect className="sk-wsh" x="188" y="68.8" width="5" height="38.4" />
        <rect
          className="sk-nut"
          x="195"
          y="66.3"
          width="22"
          height="43.4"
          rx="2"
        />
        <path
          className="sk-tool"
          d="M219 54 h62 v68 h-62 v-13 h18 v-42 h-18 z"
        />
        <path
          className="sk-arr"
          d="M296 48 a46 46 0 0 1 0 80"
          markerEnd={`url(#${saId})`}
        />
        <line className="sk-axis" x1="8" y1="88" x2="300" y2="88" />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          13 mm, or the wrench on a skate tool
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Undo it over a cloth — the washers are easy to lose
        </text>
      </svg>
    );
  }

  if (stem === "clean-02-out" || stem === "2") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="The end of the truck axle caught inside a bearing while the wheel is levered sideways to pull the bearing out of its seat"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <rect className="sk-axle" x="14" y="75.6" width="172" height="24.8" />
        <g transform="rotate(-6 176 88)">
          <rect
            className="sk-st"
            x="166.0"
            y="53.9"
            width="21.7"
            height="3.5"
          />
          <rect
            className="sk-st"
            x="166.0"
            y="72.1"
            width="21.7"
            height="3.5"
          />
          <circle className="sk-ball" cx="176.8" cy="64.8" r="7.4" />
          <rect
            className="sk-st"
            x="166.0"
            y="118.6"
            width="21.7"
            height="3.5"
          />
          <rect
            className="sk-st"
            x="166.0"
            y="100.4"
            width="21.7"
            height="3.5"
          />
          <circle className="sk-ball" cx="176.8" cy="111.2" r="7.4" />
          <rect
            className="sk-ure"
            x="188.0"
            y="38.4"
            width="134.0"
            height="15.5"
          />
          <rect
            className=""
            x="188.0"
            y="38.4"
            width="134.0"
            height="15.5"
            fill={`url(#${suId})`}
            stroke="none"
          />
          <rect
            className="sk-ure"
            x="188.0"
            y="122.1"
            width="134.0"
            height="15.5"
          />
          <rect
            className=""
            x="188.0"
            y="122.1"
            width="134.0"
            height="15.5"
            fill={`url(#${suId})`}
            stroke="none"
          />
          <path
            className="sk-brk"
            d="M322.0 38.4 L327.0 51.4 L317.0 64.4 L327.0 77.4 L317.0 90.4 L327.0 103.4 L317.0 116.4 L327.0 129.4 L317.0 137.6"
          />
        </g>
        <path
          className="sk-arr"
          d="M340 54 a48 48 0 0 1 10 36"
          markerEnd={`url(#${saId})`}
        />
        <line className="sk-axis" x1="8" y1="88" x2="160" y2="88" />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Hook the inner race on the axle tip
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Then lever the wheel sideways until it walks out
        </text>
      </svg>
    );
  }

  if (stem === "clean-03-shield" || stem === "3") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="Two views of the same bearing face on: on the left the shield is in place with a pin slipped under its inner edge beside the bore, on the right the shield is off and the seven balls are visible"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <circle className="sk-st" cx="104.0" cy="92" r="40.0" />
        <circle className="sk-st" cx="104.0" cy="92" r="35.9" />
        <circle className="sk-sh" cx="104.0" cy="92" r="31.2" />
        <circle className="sk-st" cx="104.0" cy="92" r="18.6" />
        <circle className="sk-hole" cx="104.0" cy="92" r="14.6" />
        <circle className="sk-st" cx="288.0" cy="92" r="40.0" />
        <circle className="sk-st" cx="288.0" cy="92" r="35.9" />
        <circle className="sk-ball" cx="288.0" cy="64.7" r="8.6" />
        <circle className="sk-ball" cx="309.3" cy="75.0" r="8.6" />
        <circle className="sk-ball" cx="314.6" cy="98.1" r="8.6" />
        <circle className="sk-ball" cx="299.8" cy="116.6" r="8.6" />
        <circle className="sk-ball" cx="276.2" cy="116.6" r="8.6" />
        <circle className="sk-ball" cx="261.4" cy="98.1" r="8.6" />
        <circle className="sk-ball" cx="266.7" cy="75.0" r="8.6" />
        <circle className="sk-st" cx="288.0" cy="92" r="18.6" />
        <circle className="sk-hole" cx="288.0" cy="92" r="14.6" />
        <path className="sk-tool" d="M34 140 L84.8 96.1 l2 -8 z" />
        <path
          className="sk-arr"
          d="M162 90 L236 90"
          markerEnd={`url(#${saId})`}
        />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Pin under the inner edge
        </text>
        <text className="sk-t" x="386" y="18" textAnchor="end">
          and it comes away whole
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Beside the bore, never the outer edge
        </text>
      </svg>
    );
  }

  if (stem === "clean-04-soak" || stem === "4") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="Bearings with their shields off sitting in a closed jar of solvent, with an arrow showing the jar being shaken"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <rect
          className="sk-jar"
          x="106"
          y="30"
          width="136"
          height="11"
          rx="2"
        />
        <path
          className="sk-jar"
          d="M116 41 v73 a18 18 0 0 0 18 18 h80 a18 18 0 0 0 18 -18 v-73"
        />
        <path
          className="sk-liq"
          d="M116 68 v46 a18 18 0 0 0 18 18 h80 a18 18 0 0 0 18 -18 v-46 z"
        />
        <circle className="sk-st" cx="146" cy="98" r="14.0" />
        <circle className="sk-st" cx="146" cy="98" r="12.6" />
        <circle className="sk-ball" cx="146.0" cy="88.5" r="3.0" />
        <circle className="sk-ball" cx="153.5" cy="92.0" r="3.0" />
        <circle className="sk-ball" cx="155.3" cy="100.1" r="3.0" />
        <circle className="sk-ball" cx="150.1" cy="106.6" r="3.0" />
        <circle className="sk-ball" cx="141.9" cy="106.6" r="3.0" />
        <circle className="sk-ball" cx="136.7" cy="100.1" r="3.0" />
        <circle className="sk-ball" cx="138.5" cy="92.0" r="3.0" />
        <circle className="sk-st" cx="146" cy="98" r="6.5" />
        <circle className="sk-hole" cx="146" cy="98" r="5.1" />
        <circle className="sk-st" cx="180" cy="112" r="14.0" />
        <circle className="sk-st" cx="180" cy="112" r="12.6" />
        <circle className="sk-ball" cx="180.0" cy="102.5" r="3.0" />
        <circle className="sk-ball" cx="187.5" cy="106.0" r="3.0" />
        <circle className="sk-ball" cx="189.3" cy="114.1" r="3.0" />
        <circle className="sk-ball" cx="184.1" cy="120.6" r="3.0" />
        <circle className="sk-ball" cx="175.9" cy="120.6" r="3.0" />
        <circle className="sk-ball" cx="170.7" cy="114.1" r="3.0" />
        <circle className="sk-ball" cx="172.5" cy="106.0" r="3.0" />
        <circle className="sk-st" cx="180" cy="112" r="6.5" />
        <circle className="sk-hole" cx="180" cy="112" r="5.1" />
        <circle className="sk-st" cx="206" cy="94" r="14.0" />
        <circle className="sk-st" cx="206" cy="94" r="12.6" />
        <circle className="sk-ball" cx="206.0" cy="84.5" r="3.0" />
        <circle className="sk-ball" cx="213.5" cy="88.0" r="3.0" />
        <circle className="sk-ball" cx="215.3" cy="96.1" r="3.0" />
        <circle className="sk-ball" cx="210.1" cy="102.6" r="3.0" />
        <circle className="sk-ball" cx="201.9" cy="102.6" r="3.0" />
        <circle className="sk-ball" cx="196.7" cy="96.1" r="3.0" />
        <circle className="sk-ball" cx="198.5" cy="88.0" r="3.0" />
        <circle className="sk-st" cx="206" cy="94" r="6.5" />
        <circle className="sk-hole" cx="206" cy="94" r="5.1" />
        <circle className="sk-st" cx="165" cy="84" r="14.0" />
        <circle className="sk-st" cx="165" cy="84" r="12.6" />
        <circle className="sk-ball" cx="165.0" cy="74.5" r="3.0" />
        <circle className="sk-ball" cx="172.5" cy="78.0" r="3.0" />
        <circle className="sk-ball" cx="174.3" cy="86.1" r="3.0" />
        <circle className="sk-ball" cx="169.1" cy="92.6" r="3.0" />
        <circle className="sk-ball" cx="160.9" cy="92.6" r="3.0" />
        <circle className="sk-ball" cx="155.7" cy="86.1" r="3.0" />
        <circle className="sk-ball" cx="157.5" cy="78.0" r="3.0" />
        <circle className="sk-st" cx="165" cy="84" r="6.5" />
        <circle className="sk-hole" cx="165" cy="84" r="5.1" />
        <path
          className="sk-arr"
          d="M296 62 a32 32 0 1 1 -12 -22"
          markerEnd={`url(#${saId})`}
        />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Cover them, lid on
        </text>
        <text className="sk-t" x="386" y="118" textAnchor="end">
          Shake hard, then
        </text>
        <text className="sk-t" x="386" y="134" textAnchor="end">
          leave them ten minutes
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Rubber shields stay out — soap and warm water for those
        </text>
      </svg>
    );
  }

  if (stem === "clean-05-dry" || stem === "5") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="Four open bearings drying on a cloth with air blown over them"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <circle className="sk-st" cx="110" cy="96" r="21.0" />
        <circle className="sk-st" cx="110" cy="96" r="18.9" />
        <circle className="sk-ball" cx="110.0" cy="81.7" r="4.5" />
        <circle className="sk-ball" cx="121.2" cy="87.1" r="4.5" />
        <circle className="sk-ball" cx="124.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="116.2" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="103.8" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="96.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="98.8" cy="87.1" r="4.5" />
        <circle className="sk-st" cx="110" cy="96" r="9.8" />
        <circle className="sk-hole" cx="110" cy="96" r="7.6" />
        <circle className="sk-st" cx="166" cy="96" r="21.0" />
        <circle className="sk-st" cx="166" cy="96" r="18.9" />
        <circle className="sk-ball" cx="166.0" cy="81.7" r="4.5" />
        <circle className="sk-ball" cx="177.2" cy="87.1" r="4.5" />
        <circle className="sk-ball" cx="180.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="172.2" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="159.8" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="152.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="154.8" cy="87.1" r="4.5" />
        <circle className="sk-st" cx="166" cy="96" r="9.8" />
        <circle className="sk-hole" cx="166" cy="96" r="7.6" />
        <circle className="sk-st" cx="222" cy="96" r="21.0" />
        <circle className="sk-st" cx="222" cy="96" r="18.9" />
        <circle className="sk-ball" cx="222.0" cy="81.7" r="4.5" />
        <circle className="sk-ball" cx="233.2" cy="87.1" r="4.5" />
        <circle className="sk-ball" cx="236.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="228.2" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="215.8" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="208.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="210.8" cy="87.1" r="4.5" />
        <circle className="sk-st" cx="222" cy="96" r="9.8" />
        <circle className="sk-hole" cx="222" cy="96" r="7.6" />
        <circle className="sk-st" cx="278" cy="96" r="21.0" />
        <circle className="sk-st" cx="278" cy="96" r="18.9" />
        <circle className="sk-ball" cx="278.0" cy="81.7" r="4.5" />
        <circle className="sk-ball" cx="289.2" cy="87.1" r="4.5" />
        <circle className="sk-ball" cx="292.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="284.2" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="271.8" cy="108.9" r="4.5" />
        <circle className="sk-ball" cx="264.0" cy="99.2" r="4.5" />
        <circle className="sk-ball" cx="266.8" cy="87.1" r="4.5" />
        <circle className="sk-st" cx="278" cy="96" r="9.8" />
        <circle className="sk-hole" cx="278" cy="96" r="7.6" />
        <rect
          className="sk-cloth"
          x="76"
          y="122"
          width="248"
          height="13"
          rx="3"
        />
        <path
          className="sk-arr thin"
          d="M96 44 L108 72"
          markerEnd={`url(#${saId})`}
        />
        <path
          className="sk-arr thin"
          d="M152 44 L164 72"
          markerEnd={`url(#${saId})`}
        />
        <path
          className="sk-arr thin"
          d="M208 44 L220 72"
          markerEnd={`url(#${saId})`}
        />
        <path
          className="sk-arr thin"
          d="M264 44 L276 72"
          markerEnd={`url(#${saId})`}
        />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Compressed air, or time
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Wait until there is no solvent smell left at all
        </text>
      </svg>
    );
  }

  if (stem === "clean-06-oil" || stem === "6") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="A dropper putting two drops of oil into the open raceway of a bearing with its shield removed"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <circle className="sk-st" cx="130.0" cy="106" r="44.0" />
        <circle className="sk-st" cx="130.0" cy="106" r="39.5" />
        <circle className="sk-ball" cx="130.0" cy="76.0" r="9.5" />
        <circle className="sk-ball" cx="153.5" cy="87.3" r="9.5" />
        <circle className="sk-ball" cx="159.3" cy="112.7" r="9.5" />
        <circle className="sk-ball" cx="143.0" cy="133.0" r="9.5" />
        <circle className="sk-ball" cx="117.0" cy="133.0" r="9.5" />
        <circle className="sk-ball" cx="100.7" cy="112.7" r="9.5" />
        <circle className="sk-ball" cx="106.5" cy="87.3" r="9.5" />
        <circle className="sk-st" cx="130.0" cy="106" r="20.5" />
        <circle className="sk-hole" cx="130.0" cy="106" r="16.0" />
        <path className="sk-tool" d="M117 24 h26 v28 l-8 13 h-10 l-8 -13 z" />
        <circle className="sk-drop" cx="130" cy="72" r="5" />
        <circle className="sk-drop" cx="130" cy="57" r="4" />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Two drops into the raceway
        </text>
        <text className="sk-t" x="386" y="84" textAnchor="end">
          One drop if the balls are ceramic
        </text>
        <text className="sk-t" x="386" y="102" textAnchor="end">
          Then spin it in your fingers
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Never oil a bearing you have not cleaned
        </text>
      </svg>
    );
  }

  if (stem === "clean-07-reshield" || stem === "7") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="Two views of the same bearing face on: on the left it is open with the balls visible, on the right the shield is back in place"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <circle className="sk-st" cx="104.0" cy="92" r="40.0" />
        <circle className="sk-st" cx="104.0" cy="92" r="35.9" />
        <circle className="sk-ball" cx="104.0" cy="64.7" r="8.6" />
        <circle className="sk-ball" cx="125.3" cy="75.0" r="8.6" />
        <circle className="sk-ball" cx="130.6" cy="98.1" r="8.6" />
        <circle className="sk-ball" cx="115.8" cy="116.6" r="8.6" />
        <circle className="sk-ball" cx="92.2" cy="116.6" r="8.6" />
        <circle className="sk-ball" cx="77.4" cy="98.1" r="8.6" />
        <circle className="sk-ball" cx="82.7" cy="75.0" r="8.6" />
        <circle className="sk-st" cx="104.0" cy="92" r="18.6" />
        <circle className="sk-hole" cx="104.0" cy="92" r="14.6" />
        <circle className="sk-st" cx="288.0" cy="92" r="40.0" />
        <circle className="sk-st" cx="288.0" cy="92" r="35.9" />
        <circle className="sk-sh" cx="288.0" cy="92" r="31.2" />
        <circle className="sk-st" cx="288.0" cy="92" r="18.6" />
        <circle className="sk-hole" cx="288.0" cy="92" r="14.6" />
        <path
          className="sk-arr"
          d="M162 90 L236 90"
          markerEnd={`url(#${saId})`}
        />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Flat in its groove
        </text>
        <text className="sk-t" x="386" y="18" textAnchor="end">
          printed side out, thumbed round
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          Then spin it — a shield that is fouling sounds wrong straight away
        </text>
      </svg>
    );
  }

  if (stem === "clean-08-back" || stem === "8") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 172"
        role="img"
        aria-label="A bearing on the truck axle being pressed squarely into its seat in the wheel, with guide lines showing the alignment"
        {...props}
        className={`bfig step-fig bearing-fig-root ${props.className ?? ""}`}
      >
        <defs>
          <marker
            id={saId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
          <pattern
            id={suId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
        </defs>
        <rect
          className="sk-ure"
          x="176.0"
          y="29.1"
          width="164.0"
          height="24.8"
        />
        <rect
          className=""
          x="176.0"
          y="29.1"
          width="164.0"
          height="24.8"
          fill={`url(#${suId})`}
          stroke="none"
        />
        <rect
          className="sk-ure"
          x="176.0"
          y="122.1"
          width="164.0"
          height="24.8"
        />
        <rect
          className=""
          x="176.0"
          y="122.1"
          width="164.0"
          height="24.8"
          fill={`url(#${suId})`}
          stroke="none"
        />
        <path
          className="sk-brk"
          d="M340.0 29.1 L345.0 42.1 L335.0 55.1 L345.0 68.1 L335.0 81.1 L345.0 94.1 L335.0 107.1 L345.0 120.1 L335.0 133.1 L345.0 146.1 L335.0 146.9"
        />
        <rect
          className="sk-seat"
          x="176.0"
          y="53.9"
          width="21.7"
          height="68.2"
        />
        <rect className="sk-axle" x="14" y="75.6" width="216" height="24.8" />
        <rect className="sk-st" x="112.0" y="53.9" width="21.7" height="3.5" />
        <rect className="sk-st" x="112.0" y="72.1" width="21.7" height="3.5" />
        <circle className="sk-ball" cx="122.8" cy="64.8" r="7.4" />
        <rect className="sk-st" x="112.0" y="118.6" width="21.7" height="3.5" />
        <rect className="sk-st" x="112.0" y="100.4" width="21.7" height="3.5" />
        <circle className="sk-ball" cx="122.8" cy="111.2" r="7.4" />
        <path
          className="sk-arr"
          d="M74 43.0 L162.0 43.0"
          markerEnd={`url(#${saId})`}
        />
        <line className="sk-guide" x1="112" y1="52.0" x2="358" y2="52.0" />
        <line className="sk-guide" x1="112" y1="124.0" x2="358" y2="124.0" />
        <line className="sk-axis" x1="8" y1="88" x2="360" y2="88" />
        <text className="sk-t" x="14" y="18" textAnchor="start">
          Square to its seat, the dashed outline
        </text>
        <text className="sk-t" x="14" y="164" textAnchor="start">
          The axle is what keeps it straight going in
        </text>
      </svg>
    );
  }

  return null;
}
