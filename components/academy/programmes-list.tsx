import { getAcademyProgrammes, AcademyProgrammeData } from "lib/sanity/queries";
import Link from "next/link";
import { getLocalizedPath } from "lib/i18n";

export default async function AcademyProgrammesList({ locale }: { locale: string }) {
  const programmes = await getAcademyProgrammes();

  if (programmes.length === 0) return null;

  return (
    <section className="w-full bg-neutral-50 dark:bg-neutral-900 py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2
              className="text-2xl md:text-4xl font-bold uppercase text-neutral-900 dark:text-neutral-100"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Available Programmes
            </h2>
            <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
              Group workshops, private coaching, and weekend sessions across major cities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((p: AcademyProgrammeData) => (
            <div
              key={p._id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                    {p.city}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      p.bookingEnabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {p.bookingEnabled ? "Booking Open" : "Closed"}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {locale === "hi" && p.title_hi ? p.title_hi : p.title_en}
                </h3>

                {p.description_en && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
                    {p.description_en}
                  </p>
                )}

                {p.skillLevels && p.skillLevels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.skillLevels.map((lvl) => (
                      <span
                        key={lvl}
                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {lvl}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={getLocalizedPath("/contact", locale)}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  p.bookingEnabled
                    ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    : "bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500"
                }`}
              >
                {p.bookingEnabled ? "Enquire / Register" : "Fully Booked"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
