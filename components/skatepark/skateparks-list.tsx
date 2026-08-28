import { getSkateparks, SkateparkData } from "lib/sanity/queries";

export default async function SkateparksList() {
  const parks = await getSkateparks();

  if (parks.length === 0) return null;

  return (
    <section className="w-full bg-neutral-900 text-white py-16 md:py-24 border-t border-neutral-800">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="mb-12">
          <h2
            className="text-2xl md:text-4xl font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Our Construction Projects
          </h2>
          <p className="mt-2 text-neutral-400 text-sm md:text-base">
            Track current DIY & municipal concrete skateparks built by WeSkate Co across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park: SkateparkData) => {
            const status = park.constructionStatus ?? "planned";
            const pct = park.completionPercentage ?? 0;

            return (
              <div
                key={park._id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300">
                      📍 {park.city}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        status === "completed"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                          : status === "in_progress"
                            ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                            : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {park.name}
                  </h3>

                  {park.description_en && (
                    <p className="text-sm text-neutral-400 mb-6 line-clamp-3">
                      {park.description_en}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-1.5">
                    <span>Build Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
