"use client";

import { useId, type KeyboardEvent, type SVGProps } from "react";
import "./figure-styles.css";

export interface BearingAnatomyFigProps extends SVGProps<SVGSVGElement> {
  selectedPart: string;
  onSelectPart: (key: string) => void;
}

export function BearingAnatomyFig({
  selectedPart,
  onSelectPart,
  ...props
}: BearingAnatomyFigProps) {
  const rawId = useId().replace(/:/g, "");
  const lubdotsId = `lubdots-${rawId}`;

  const handleKeyDown = (key: string) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectPart(key);
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 382"
      role="img"
      aria-label="A 608 skateboard bearing drawn face on with half its shield left in place, beside a section through it. Six parts are numbered: outer race, inner race, balls, retainer, shield and lubricant."
      {...props}
      className={`bfig bearing-fig-root ${props.className ?? ""}`}
    >
      <defs>
        <pattern
          id={lubdotsId}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.1" fill="currentColor" />
        </pattern>
      </defs>
      <g
        className={`bpart ${selectedPart === "race-out" ? "on" : ""}`}
        data-p="race-out"
        tabIndex={0}
        role="button"
        aria-label="Outer race"
        onClick={() => onSelectPart("race-out")}
        onKeyDown={handleKeyDown("race-out")}
      >
        <path
          className="hi"
          fillRule="evenodd"
          d="M53.00 172.0a99.00 99.00 0 1 0 198.00 0a99.00 99.00 0 1 0 -198.00 0ZM63.07 172.0a88.93 88.93 0 1 1 177.86 0a88.93 88.93 0 1 1 -177.86 0Z"
        />
        <path
          className="hi"
          d="M332.00 73.00L395.00 73.00L395.00 83.07L382.79 83.07A23.14 23.14 0 0 0 344.21 83.07L332.00 83.07Z"
        />
        <path
          className="hi"
          d="M332.00 271.00L395.00 271.00L395.00 260.93L382.79 260.93A23.14 23.14 0 0 1 344.21 260.93L332.00 260.93Z"
        />
      </g>
      <g
        className={`bpart ${selectedPart === "race-in" ? "on" : ""}`}
        data-p="race-in"
        tabIndex={0}
        role="button"
        aria-label="Inner race"
        onClick={() => onSelectPart("race-in")}
        onKeyDown={handleKeyDown("race-in")}
      >
        <path
          className="hi"
          fillRule="evenodd"
          d="M105.93 172.0a46.07 46.07 0 1 0 92.14 0a46.07 46.07 0 1 0 -92.14 0ZM116.00 172.0a36.00 36.00 0 1 1 72.00 0a36.00 36.00 0 1 1 -72.00 0Z"
        />
        <path
          className="hi"
          d="M332.00 136.00L395.00 136.00L395.00 125.93L382.79 125.93A23.14 23.14 0 0 1 344.21 125.93L332.00 125.93Z"
        />
        <path
          className="hi"
          d="M332.00 208.00L395.00 208.00L395.00 218.07L382.79 218.07A23.14 23.14 0 0 0 344.21 218.07L332.00 218.07Z"
        />
      </g>
      <g
        className={`bpart ${selectedPart === "lube" ? "on" : ""}`}
        data-p="lube"
        tabIndex={0}
        role="button"
        aria-label="Lubricant"
        onClick={() => onSelectPart("lube")}
        onKeyDown={handleKeyDown("lube")}
      >
        <rect
          className="lub"
          x="332.00"
          y="83.07"
          width="63.00"
          height="42.86"
          fill={`url(#${lubdotsId})`}
        />
        <rect
          className="lub"
          x="332.00"
          y="218.07"
          width="63.00"
          height="42.86"
          fill={`url(#${lubdotsId})`}
        />
      </g>
      <g
        className={`bpart ${selectedPart === "cage" ? "on" : ""}`}
        data-p="cage"
        tabIndex={0}
        role="button"
        aria-label="Ball retainer"
        onClick={() => onSelectPart("cage")}
        onKeyDown={handleKeyDown("cage")}
      >
        <path
          className="hi lite"
          fillRule="evenodd"
          d="M73.25 172.0a78.75 78.75 0 1 0 157.50 0a78.75 78.75 0 1 0 -157.50 0ZM95.75 172.0a56.25 56.25 0 1 1 112.50 0a56.25 56.25 0 1 1 -112.50 0ZM130.03 104.50a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM182.80 129.91a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM195.84 187.02a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM159.32 232.82a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM100.74 232.82a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM64.22 187.02a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0ZM77.26 129.91a21.97 21.97 0 1 1 43.94 0a21.97 21.97 0 1 1 -43.94 0Z"
        />
        <rect
          className="hi lite"
          x="338.63"
          y="87.36"
          width="4.50"
          height="34.29"
          rx="1"
        />
        <rect
          className="hi lite"
          x="383.87"
          y="87.36"
          width="4.50"
          height="34.29"
          rx="1"
        />
        <rect
          className="hi lite"
          x="338.63"
          y="222.36"
          width="4.50"
          height="34.29"
          rx="1"
        />
        <rect
          className="hi lite"
          x="383.87"
          y="222.36"
          width="4.50"
          height="34.29"
          rx="1"
        />
      </g>
      <g
        className={`bpart ${selectedPart === "balls" ? "on" : ""}`}
        data-p="balls"
        tabIndex={0}
        role="button"
        aria-label="Balls"
        onClick={() => onSelectPart("balls")}
        onKeyDown={handleKeyDown("balls")}
      >
        <circle className="hi solid" cx="152.00" cy="104.50" r="21.43" />
        <circle className="hi solid" cx="204.77" cy="129.91" r="21.43" />
        <circle className="hi solid" cx="217.81" cy="187.02" r="21.43" />
        <circle className="hi solid" cx="181.29" cy="232.82" r="21.43" />
        <circle className="hi solid" cx="122.71" cy="232.82" r="21.43" />
        <circle className="hi solid" cx="86.19" cy="187.02" r="21.43" />
        <circle className="hi solid" cx="99.23" cy="129.91" r="21.43" />
        <circle className="hi solid" cx="363.50" cy="104.50" r="21.43" />
        <circle className="hi solid" cx="363.50" cy="239.50" r="21.43" />
      </g>
      <g
        className={`bpart ${selectedPart === "shield" ? "on" : ""}`}
        data-p="shield"
        tabIndex={0}
        role="button"
        aria-label="Shield"
        onClick={() => onSelectPart("shield")}
        onKeyDown={handleKeyDown("shield")}
      >
        <path
          className="hi sh"
          d="M152.00 75.70A96.30 96.30 0 0 1 152.00 268.30L152.00 220.77A48.77 48.77 0 0 0 152.00 123.23Z"
        />
        <rect
          className="hi shp"
          x="335.60"
          y="82.00"
          width="3.15"
          height="41.23"
        />
        <rect
          className="hi shp"
          x="388.25"
          y="82.00"
          width="3.15"
          height="41.23"
        />
        <rect
          className="hi shp"
          x="335.60"
          y="220.77"
          width="3.15"
          height="41.23"
        />
        <rect
          className="hi shp"
          x="388.25"
          y="220.77"
          width="3.15"
          height="41.23"
        />
      </g>
      <line className="axis" x1="312.00" y1="172.00" x2="415.00" y2="172.00" />
      <line
        x1="152.00"
        y1="73.00"
        x2="152.00"
        y2="271.00"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="5 4"
        opacity=".5"
      />
      <g className="dim">
        <line x1="429.0" y1="73.00" x2="429.0" y2="271.00" />
        <line x1="425.0" y1="73.00" x2="433.0" y2="73.00" />
        <line x1="425.0" y1="271.00" x2="433.0" y2="271.00" />
        <text x="437.0" y="176.00" textAnchor="start">
          22
        </text>
      </g>
      <g className="dim">
        <line x1="306.0" y1="136.00" x2="306.0" y2="208.00" />
        <line x1="302.0" y1="136.00" x2="310.0" y2="136.00" />
        <line x1="302.0" y1="208.00" x2="310.0" y2="208.00" />
        <text x="298.0" y="176.00" textAnchor="end">
          8
        </text>
      </g>
      <g className="dim">
        <line x1="332.00" y1="295.0" x2="395.00" y2="295.0" />
        <line x1="332.00" y1="291.0" x2="332.00" y2="299.0" />
        <line x1="395.00" y1="291.0" x2="395.00" y2="299.0" />
        <text x="363.50" y="312.0" textAnchor="middle">
          7
        </text>
      </g>
      <text className="dimnote" x="363.50" y="333.00" textAnchor="middle">
        Millimetres · the 608 size
      </text>
      <g
        className={`badge ${selectedPart === "race-out" ? "on" : ""}`}
        data-b="race-out"
        tabIndex={0}
        role="button"
        aria-label={`Select race-out`}
        onClick={() => onSelectPart("race-out")}
        onKeyDown={handleKeyDown("race-out")}
      >
        <line className="lead" x1="129.13" y1="64.40" x2="132.46" y2="80.09" />
        <circle cx="126.63" cy="52.67" r="11" />
        <text x="126.63" y="56.67" textAnchor="middle">
          1
        </text>
      </g>
      <g
        className={`badge ${selectedPart === "balls" ? "on" : ""}`}
        data-b="balls"
        tabIndex={0}
        role="button"
        aria-label={`Select balls`}
        onClick={() => onSelectPart("balls")}
        onKeyDown={handleKeyDown("balls")}
      >
        <line className="lead" x1="66.03" y1="103.37" x2="99.25" y2="129.89" />
        <circle cx="56.65" cy="95.89" r="11" />
        <text x="56.65" y="99.89" textAnchor="middle">
          3
        </text>
      </g>
      <g
        className={`badge ${selectedPart === "cage" ? "on" : ""}`}
        data-b="cage"
        tabIndex={0}
        role="button"
        aria-label={`Select cage`}
        onClick={() => onSelectPart("cage")}
        onKeyDown={handleKeyDown("cage")}
      >
        <line className="lead" x1="44.82" y1="147.26" x2="86.23" y2="156.82" />
        <circle cx="33.13" cy="144.56" r="11" />
        <text x="33.13" y="148.56" textAnchor="middle">
          4
        </text>
      </g>
      <g
        className={`badge ${selectedPart === "shield" ? "on" : ""}`}
        data-b="shield"
        tabIndex={0}
        role="button"
        aria-label={`Select shield`}
        onClick={() => onSelectPart("shield")}
        onKeyDown={handleKeyDown("shield")}
      >
        <line
          className="lead"
          x1="245.29"
          y1="113.71"
          x2="213.51"
          y2="133.56"
        />
        <circle cx="255.46" cy="107.35" r="11" />
        <text x="255.46" y="111.35" textAnchor="middle">
          5
        </text>
      </g>
      <g
        className={`badge ${selectedPart === "race-in" ? "on" : ""}`}
        data-b="race-in"
        tabIndex={0}
        role="button"
        aria-label={`Select race-in`}
        onClick={() => onSelectPart("race-in")}
        onKeyDown={handleKeyDown("race-in")}
      >
        <line
          className="lead"
          x1="126.00"
          y1="175.00"
          x2="110.96"
          y2="172.00"
        />
        <circle cx="137.00" cy="175.00" r="11" />
        <text x="137.00" y="179.00" textAnchor="middle">
          2
        </text>
      </g>
      <g
        className={`badge ${selectedPart === "lube" ? "on" : ""}`}
        data-b="lube"
        tabIndex={0}
        role="button"
        aria-label={`Select lube`}
        onClick={() => onSelectPart("lube")}
        onKeyDown={handleKeyDown("lube")}
      >
        <line
          className="lead"
          x1="424.00"
          y1="104.50"
          x2="397.00"
          y2="104.50"
        />
        <circle cx="435.00" cy="104.50" r="11" />
        <text x="435.00" y="108.50" textAnchor="middle">
          6
        </text>
      </g>
      <text className="vcap" x="16" y="311.00">
        Face on · shield left on at right
      </text>
      <text className="vcap" x="363.50" y="55.00" textAnchor="middle">
        Section
      </text>
    </svg>
  );
}
