"use client";

import {
  FigCaption,
  FigCard,
  FigHint,
  GRID_CLASS,
  PanelKicker,
  ProseCols,
  Section,
  SectionHeader,
  Container,
  Note,
} from "components/guides/ui";
import {
  MECH_CAPTION,
  MECH_HINT,
  MECH_NOTE,
  MECH_PROSE,
  MECH_SECTION,
  MECH_STOCKED,
  SURF_PARTS,
} from "lib/surfskate-guide/data";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { Stocked } from "./bits";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

type PartKey = (typeof SURF_PARTS)[number]["key"];

export default function MechanismSection() {
  const [activeKey, setActiveKey] = useState<PartKey>("axis");
  const part = SURF_PARTS.find((p) => p.key === activeKey) ?? SURF_PARTS[0]!;

  const select = (key: PartKey) => () => setActiveKey(key);
  const onKey = (key: PartKey) => (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveKey(key);
    }
  };

  // Shared interaction props for each selectable drawing region. Mirrors the
  // deck guide's ply figure: a focusable SVG group with aria-pressed.
  const groupProps = (key: PartKey) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": activeKey === key,
    onClick: select(key),
    onKeyDown: onKey(key),
  });

  const label = (key: PartKey) => {
    const p = SURF_PARTS.find((x) => x.key === key)!;
    return `Part ${String(p.n).padStart(2, "0")}: ${p.title}`;
  };

  return (
    <Section id="mech">
      <Container>
        <SectionHeader
          kicker={MECH_SECTION.kicker}
          title={MECH_SECTION.title}
          intro={MECH_SECTION.intro}
        />

        <div className={GRID_CLASS}>
          {/* Figure + part diagram */}
          <div className="lg:col-span-5 w-full flex flex-col gap-4">
            <FigHint>{MECH_HINT}</FigHint>
            <FigCard tone="muted">
              <div className="surfskate-figs -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
                <svg
                  viewBox="0 0 560 424"
                  role="img"
                  aria-label="A standard skateboard truck and a surfskate front truck drawn from above at the same scale, with the nose of the board upward. The standard truck turns only on its kingpin. The surfskate truck carries an arm in front of the axle that swings on a second vertical axis, with the whole axle and both wheels ghosted at full swing. Below, the same board from the side with the nose to the right, showing the riser, the conventional rear truck and the front arm reaching forward of the axle."
                >
                  <defs>
                    <marker
                      id="sa"
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

                  <text className="dimnote" x="144" y="26" textAnchor="middle">
                    A STANDARD TRUCK
                  </text>
                  <text className="sf-t" x="144" y="46" textAnchor="middle">
                    The axle stays square to the deck
                  </text>
                  <text className="dimnote" x="406" y="26" textAnchor="middle">
                    A SURFSKATE FRONT TRUCK
                  </text>
                  <text className="sf-t" x="406" y="46" textAnchor="middle">
                    An arm in front of the axle swings
                  </text>

                  <path
                    className="sk-arr thin"
                    d="M26 196 L26 118"
                    markerEnd="url(#sa)"
                  />
                  <text className="dimnote" x="26" y="214" textAnchor="middle">
                    NOSE
                  </text>

                  <line
                    className="sk-axis"
                    x1="144"
                    y1="80"
                    x2="144"
                    y2="200"
                  />
                  <rect
                    className="sf-wheel soft"
                    x="69.0"
                    y="127.0"
                    width="20.0"
                    height="50.0"
                    rx="5"
                  />
                  <rect
                    className="sf-wheel soft"
                    x="199.0"
                    y="127.0"
                    width="20.0"
                    height="50.0"
                    rx="5"
                  />
                  <rect
                    className="sf-hanger"
                    x="80.0"
                    y="145.0"
                    width="128.0"
                    height="14"
                    rx="6"
                  />
                  <circle className="sf-pin" cx="144" cy="152" r="4" />
                  <text className="sf-t" x="144" y="222" textAnchor="middle">
                    One axis — the kingpin
                  </text>

                  <line
                    className="sf-axis2"
                    x1="406"
                    y1="72"
                    x2="406"
                    y2="200"
                  />
                  <g
                    className="sf-deck ghost"
                    transform="rotate(26 406 94)"
                    fill="none"
                  >
                    <rect
                      className="sf-deck ghost"
                      x="331.0"
                      y="127.0"
                      width="20.0"
                      height="50.0"
                      rx="5"
                    />
                    <rect
                      className="sf-deck ghost"
                      x="461.0"
                      y="127.0"
                      width="20.0"
                      height="50.0"
                      rx="5"
                    />
                    <rect
                      className="sf-deck ghost"
                      x="342.0"
                      y="145.0"
                      width="128.0"
                      height="14"
                      rx="6"
                    />
                  </g>

                  <rect
                    className="sf-wheel soft"
                    x="331.0"
                    y="127.0"
                    width="20.0"
                    height="50.0"
                    rx="5"
                  />
                  <rect
                    className="sf-wheel soft"
                    x="461.0"
                    y="127.0"
                    width="20.0"
                    height="50.0"
                    rx="5"
                  />
                  <rect
                    className="sf-hanger"
                    x="342.0"
                    y="145.0"
                    width="128.0"
                    height="14"
                    rx="6"
                  />

                  <g
                    className={`bpart${activeKey === "wheels" ? " on" : ""}`}
                    aria-label={label("wheels")}
                    {...groupProps("wheels")}
                  >
                    <rect
                      className="hi lite"
                      x="331.0"
                      y="127.0"
                      width="20.0"
                      height="50.0"
                      rx="5"
                    />
                    <rect
                      className="hi lite"
                      x="461.0"
                      y="127.0"
                      width="20.0"
                      height="50.0"
                      rx="5"
                    />
                  </g>
                  <g
                    className={`bpart${activeKey === "hanger" ? " on" : ""}`}
                    aria-label={label("hanger")}
                    {...groupProps("hanger")}
                  >
                    <rect
                      className="hi lite"
                      x="342.0"
                      y="145.0"
                      width="128.0"
                      height="14"
                      rx="6"
                    />
                  </g>
                  <g
                    className={`bpart${activeKey === "arm" ? " on" : ""}`}
                    aria-label={label("arm")}
                    {...groupProps("arm")}
                  >
                    <rect
                      className="hi"
                      x="398.0"
                      y="94.0"
                      width="16"
                      height="58.0"
                      rx="7"
                    />
                  </g>
                  <g
                    className={`bpart${activeKey === "axis" ? " on" : ""}`}
                    aria-label={label("axis")}
                    {...groupProps("axis")}
                  >
                    <circle className="hi solid" cx="406" cy="94" r="10" />
                  </g>
                  <circle className="sf-pin" cx="406" cy="94" r="3.5" />
                  <path
                    className="sk-arr thin"
                    d="M406.0 186.0 A 92 92 0 0 1 365.7 176.7"
                    markerEnd="url(#sa)"
                  />
                  <text className="sf-t" x="406" y="222" textAnchor="middle">
                    Two axes — kingpin and pivot
                  </text>

                  <text className="dimnote" x="24" y="258" textAnchor="start">
                    THE SAME BOARD FROM THE SIDE — NOSE TO THE RIGHT
                  </text>
                  <rect
                    className="sf-deck"
                    x="60"
                    y="268"
                    width="452"
                    height="11"
                    rx="4"
                  />

                  <g
                    className={`bpart${activeKey === "riser" ? " on" : ""}`}
                    aria-label={label("riser")}
                    {...groupProps("riser")}
                  >
                    <rect
                      className="hi"
                      x="100"
                      y="279"
                      width="88"
                      height="16"
                      rx="2"
                    />
                    <rect
                      className="hi"
                      x="362"
                      y="279"
                      width="88"
                      height="16"
                      rx="2"
                    />
                  </g>
                  <rect
                    className="sf-hanger"
                    x="106"
                    y="295"
                    width="76"
                    height="9"
                    rx="2"
                  />
                  <rect
                    className="sf-hanger"
                    x="368"
                    y="295"
                    width="76"
                    height="9"
                    rx="2"
                  />

                  <g
                    className={`bpart${activeKey === "rear" ? " on" : ""}`}
                    aria-label={label("rear")}
                    {...groupProps("rear")}
                  >
                    <path
                      className="hi lite"
                      d="M118 304 L170 304 L153 330 L135 330 Z"
                    />
                  </g>
                  <g
                    className={`bpart${activeKey === "arm" ? " on" : ""}`}
                    aria-label={label("arm")}
                    {...groupProps("arm")}
                  >
                    <path
                      className="hi"
                      d="M436 301 L450 301 L415 330 L397 330 Z"
                    />
                  </g>
                  <g
                    className={`bpart${activeKey === "axis" ? " on" : ""}`}
                    aria-label={label("axis")}
                    {...groupProps("axis")}
                  >
                    <circle className="hi solid" cx="443" cy="301" r="8" />
                  </g>

                  <circle className="sf-wheel soft" cx="144" cy="330" r="22" />
                  <circle className="sf-wheel" cx="144" cy="330" r="7" />
                  <circle className="sf-wheel soft" cx="406" cy="330" r="22" />
                  <circle className="sf-wheel" cx="406" cy="330" r="7" />
                  <line
                    className="sf-road"
                    x1="34"
                    y1="352"
                    x2="526"
                    y2="352"
                  />
                  <g className="dim">
                    <line x1="78" y1="279" x2="78" y2="295" />
                    <line x1="74" y1="279" x2="82" y2="279" />
                    <line x1="74" y1="295" x2="82" y2="295" />
                    <text x="68" y="291" textAnchor="end">
                      30 mm
                    </text>
                  </g>
                  <text className="sf-t" x="144" y="374" textAnchor="middle">
                    rear truck: conventional
                  </text>
                  <text
                    className="sf-t lime"
                    x="406"
                    y="374"
                    textAnchor="middle"
                  >
                    front truck: the pivot arm
                  </text>

                  <line className="lead" x1="396" y1="94" x2="354" y2="90" />
                  <g
                    className={`badge${activeKey === "axis" ? " on" : ""}`}
                    aria-label={label("axis")}
                    {...groupProps("axis")}
                  >
                    <circle cx="354" cy="90" r="11" />
                    <text x="354" y="94" textAnchor="middle">
                      01
                    </text>
                  </g>
                  <line className="lead" x1="414" y1="118" x2="452" y2="116" />
                  <g
                    className={`badge${activeKey === "arm" ? " on" : ""}`}
                    aria-label={label("arm")}
                    {...groupProps("arm")}
                  >
                    <circle cx="452" cy="116" r="11" />
                    <text x="452" y="120" textAnchor="middle">
                      02
                    </text>
                  </g>
                  <line className="lead" x1="430" y1="159" x2="436" y2="188" />
                  <g
                    className={`badge${activeKey === "hanger" ? " on" : ""}`}
                    aria-label={label("hanger")}
                    {...groupProps("hanger")}
                  >
                    <circle cx="436" cy="188" r="11" />
                    <text x="436" y="192" textAnchor="middle">
                      03
                    </text>
                  </g>
                  <line className="lead" x1="480" y1="158" x2="498" y2="158" />
                  <g
                    className={`badge${activeKey === "wheels" ? " on" : ""}`}
                    aria-label={label("wheels")}
                    {...groupProps("wheels")}
                  >
                    <circle cx="498" cy="158" r="11" />
                    <text x="498" y="162" textAnchor="middle">
                      04
                    </text>
                  </g>
                  <line className="lead" x1="362" y1="287" x2="275" y2="287" />
                  <g
                    className={`badge${activeKey === "riser" ? " on" : ""}`}
                    aria-label={label("riser")}
                    {...groupProps("riser")}
                  >
                    <circle cx="275" cy="287" r="11" />
                    <text x="275" y="291" textAnchor="middle">
                      05
                    </text>
                  </g>
                  <line className="lead" x1="118" y1="317" x2="92" y2="317" />
                  <g
                    className={`badge${activeKey === "rear" ? " on" : ""}`}
                    aria-label={label("rear")}
                    {...groupProps("rear")}
                  >
                    <circle cx="92" cy="317" r="11" />
                    <text x="92" y="321" textAnchor="middle">
                      06
                    </text>
                  </g>
                </svg>
              </div>
            </FigCard>
            <FigCaption>{MECH_CAPTION}</FigCaption>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 flex flex-col gap-5 md:gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 flex flex-col gap-4">
              <PanelKicker>
                Part {String(part.n).padStart(2, "0")} of 06
              </PanelKicker>
              <h3
                className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                style={CLASH}
              >
                {part.title}
              </h3>
              <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
                {part.body}
              </p>
            </div>
          </div>
        </div>

        <ProseCols items={MECH_PROSE} columns={3} tone="muted" />

        <Note text={MECH_NOTE} />

        <Stocked text={MECH_STOCKED} />
      </Container>
    </Section>
  );
}
