"use client";

import { GreenArrowIcon } from "components/guides/icons";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { useState } from "react";
import {
  BANDS,
  QUESTIONS,
  buildResult,
  toPath,
  type QuizAnswers,
} from "lib/board-finder/data";
import type { Unit } from "./board-finder-page";
import { renderTagged } from "components/guides/rich";

interface Props {
  unit: Unit;
  setUnit: (u: Unit) => void;
  bandIndex: number;
  setBandIndex: (i: number) => void;
}

type Answers = Pick<QuizAnswers, "who" | "goal" | "form">;

function tagClasses(tone: "cyan" | "pink" | "neutral") {
  switch (tone) {
    case "cyan":
      return "bg-neutral-100 border border-neutral-300 text-black";
    case "pink":
      return "bg-black border border-black text-white";
    default:
      return "bg-white border border-neutral-300 text-black";
  }
}
import { Container, Section, H2_CLASS } from "components/guides/ui";

export default function QuizSection({
  unit,
  setUnit,
  bandIndex,
  setBandIndex,
}: Props) {
  const { locale } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    who: "new",
    goal: "learn",
    form: "complete",
  });
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step]!;
  const currentForPips = done ? QUESTIONS.length : step;

  const options =
    question.key === "shoe"
      ? BANDS.map((band, i) => ({
          value: String(i),
          title: unit === "UK" ? band.uk : band.us,
          description: `Deck ${band.lo}″–${band.hi}″ · ${band.rider}`,
          active: bandIndex === i,
        }))
      : (question.options ?? []).map((option) => ({
          ...option,
          active:
            (question.key === "who" && answers.who === option.value) ||
            (question.key === "goal" && answers.goal === option.value) ||
            (question.key === "form" && answers.form === option.value),
        }));

  function select(optionValue: string) {
    if (question.key === "shoe") {
      setBandIndex(Number(optionValue));
    } else {
      setAnswers(
        (prev) => ({ ...prev, [question.key]: optionValue }) as Answers,
      );
    }
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function startOver() {
    setStep(0);
    setDone(false);
  }

  const result = done
    ? buildResult({ ...answers, shoeBandIndex: bandIndex })
    : null;

  return (
    <Section id="find-your-board" scroll={72}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Find your board
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Four questions. We&apos;ll turn the answers into the four numbers
            that decide how the board rides.
          </p>
        </div>

        {/* Progress pips */}
        <nav aria-label="Quiz progress">
          <ol className="flex items-center gap-2 md:gap-3">
            {QUESTIONS.map((q, i) => {
              const state =
                i < currentForPips
                  ? "done"
                  : i === currentForPips
                    ? "current"
                    : "todo";
              return (
                <li key={q.key} className="flex items-center gap-2 md:gap-3">
                  <span
                    aria-current={state === "current" ? "step" : undefined}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors ${
                      state === "done"
                        ? "bg-white text-black border border-black"
                        : state === "current"
                          ? "bg-black text-white border border-black"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i < QUESTIONS.length - 1 && (
                    <span
                      aria-hidden
                      className={`w-5 md:w-10 h-px ${
                        i < currentForPips ? "bg-black" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Panel: question or result */}
        <div className="bg-[#F7F7F9] md:bg-white rounded-[16px] border border-neutral-100/80 p-6 md:p-10">
          {!done ? (
            <div className="flex flex-col gap-6">
              {/* Question */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                <h3
                  className="text-xl md:text-[32px] font-bold tracking-[-1%] text-black uppercase leading-[110%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {question.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-500 leading-[140%]">
                  {question.hint}
                </p>
              </div>

              {/* Unit toggle, shown on the shoe-size step */}
              {question.key === "shoe" && (
                <div
                  className="inline-flex rounded-4 border border-neutral-200 p-1 gap-1 w-fit"
                  role="group"
                  aria-label="Shoe size unit"
                >
                  {(["UK", "US"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      aria-pressed={unit === u}
                      className={`px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider rounded-4 transition-colors cursor-pointer ${
                        unit === u
                          ? "bg-black text-white"
                          : "text-black hover:bg-neutral-100"
                      }`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => select(option.value)}
                    aria-pressed={
                      "active" in option ? option.active : undefined
                    }
                    className={`text-left rounded-[12px] border p-4 md:p-5 transition-colors cursor-pointer ${
                      option.active
                        ? "border-black bg-white shadow-sm"
                        : "border-neutral-200 bg-white hover:border-black"
                    }`}
                  >
                    <span
                      className="block text-base md:text-lg font-semibold text-black uppercase tracking-[-1%]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {option.title}
                    </span>
                    <span className="block text-sm text-neutral-500 leading-[140%] mt-1">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>

              {/* Back / Start over */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  className={`text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors cursor-pointer ${
                    step === 0 ? "invisible" : ""
                  }`}
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={startOver}
                  className={`text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors cursor-pointer ${
                    step === 0 ? "invisible" : ""
                  }`}
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Start over
                </button>
              </div>
            </div>
          ) : (
            result && (
              <div className="flex flex-col gap-6" aria-live="polite">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={`rounded-full px-3 py-1 text-xs md:text-sm font-semibold uppercase tracking-wider ${tagClasses(tag.tone)}`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <h3
                    className="text-xl md:text-[32px] font-bold tracking-[-1%] text-black uppercase leading-[110%]"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {result.title}
                  </h3>
                  <p
                    className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black leading-none"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {result.headline}
                  </p>
                  <p className="text-sm md:text-lg text-neutral-600 leading-[150%] max-w-2xl">
                    {result.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                  {/* Reasons */}
                  <ul className="flex flex-col gap-3">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                        <span className="text-sm md:text-base text-black leading-[150%] font-[400]">
                          {renderTagged(reason)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Spec sheet */}
                  <dl className="bg-[#F7F7F9] rounded-[12px] p-5 md:p-6 flex flex-col">
                    {result.spec.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 py-2.5 border-b border-neutral-200 last:border-b-0"
                      >
                        <dt className="text-xs md:text-sm font-medium uppercase tracking-wider text-neutral-500">
                          {label}
                        </dt>
                        <dd
                          className="text-sm md:text-base font-semibold text-black text-right"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href={getLocalizedPath(toPath(result.ctaHref), locale)}
                    className="w-full sm:w-fit bg-black text-white px-6 py-3.5 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors text-center shrink-0"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {result.ctaLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={startOver}
                    className="flex items-center gap-3 group cursor-pointer w-fit"
                  >
                    <span className="w-7 h-7 rounded-full border border-black bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-black group-hover:text-white transition-colors">
                      <GreenArrowIcon />
                    </span>
                    <span
                      className="text-lg md:text-[24px] font-bold uppercase text-black"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Start over
                    </span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </Container>
    </Section>
  );
}
