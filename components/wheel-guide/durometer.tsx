import {
  DURO_BANDS,
  DURO_INTRO,
  DURO_NOTE,
  DURO_ROWS,
  DURO_SCALES,
} from "lib/wheel-guide/data";

export default function DurometerSection() {
  return (
    <section
      id="durometer"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
          <span className="text-xs md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
            03 — Durometer
          </span>
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Durometer
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            {DURO_INTRO}
          </p>
        </div>

        {/* The two scales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {DURO_SCALES.map((scale) => (
            <div
              key={scale.title}
              className="bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 flex flex-col gap-3"
            >
              <h3
                className="text-base md:text-xl font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {scale.title}
              </h3>
              <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                {scale.text}
              </p>
            </div>
          ))}
        </div>

        {/* Band table */}
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40" />
                {DURO_BANDS.map((band) => (
                  <th key={band.range} className="pb-4 pr-6 align-bottom">
                    <span
                      className="block text-lg md:text-[24px] font-bold uppercase tracking-[-1%] text-black"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {band.range}
                    </span>
                    <span className="block text-xs md:text-sm text-neutral-500 mt-1">
                      {band.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DURO_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-neutral-100">
                  <th
                    scope="row"
                    className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Closing note */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          {DURO_NOTE}
        </p>
      </div>
    </section>
  );
}
