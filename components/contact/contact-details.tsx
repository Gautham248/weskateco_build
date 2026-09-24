import Link from "next/link";

// ---------------------------------------------------------------------------
// Contact details section — addresses, emails, phone, hours, location cards.
// ---------------------------------------------------------------------------

const emailLinks = [
  {
    label: "Skatepark projects",
    email: "webuildskateparks@gmail.com",
  },
  {
    label: "Trade & distribution",
    email: "trade@weskateco.com",
  },
  {
    label: "Orders & product support",
    email: "support@weskateco.com",
  },
];

const locations = [
  {
    title: "Head office & store — Bengaluru, Karnataka.",
    description:
      "Retail, distribution and the trade desk. Skatepark project coordination for South and West India.",
    mapsUrl: "#", // TODO: real Google Maps URL
  },
  {
    title: "Skatepark build base — Kerala.",
    description:
      "WB Skateparks construction crew and equipment yard. Projects run across India and internationally.",
    mapsUrl: "#", // TODO: real Google Maps URL
  },
];

export default function ContactDetails() {
  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 lg:px-15">
      <div className="mx-auto max-w-(--breakpoint-2xl)">
        {/* Entity + address */}
        <div className="mb-12">
          <h2
            className="fluid-text-2xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WeSkate Co
          </h2>
          <p className="text-neutral-600 text-sm md:text-base mb-2">
            Toucan Distribution Pvt Ltd · WB Skatepark Constructions LLP
          </p>
          {/* TODO: replace with the real registered office address */}
          <address className="not-italic text-neutral-500 text-sm md:text-base leading-relaxed">
            Registered office address line 1,
            <br />
            Address line 2, Bengaluru,
            <br />
            Karnataka 560000, India.
          </address>
        </div>

        {/* Contact table */}
        <div className="mb-12">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {emailLinks.map((item) => (
              <div key={item.email} className="flex flex-col">
                <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  {item.label}
                </dt>
                <dd>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-sm md:text-base text-black underline underline-offset-2 hover:text-neutral-500 transition-colors"
                  >
                    {item.email}
                  </a>
                </dd>
              </div>
            ))}

            <div className="flex flex-col">
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Telephone
              </dt>
              <dd>
                {/* TODO: replace with real number */}
                <a
                  href="tel:+919999999999"
                  className="text-sm md:text-base text-black underline underline-offset-2 hover:text-neutral-500 transition-colors"
                >
                  +91-99999-99999
                </a>
                <span className="text-xs text-neutral-400 ml-2">
                  (placeholder — TODO)
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Hours */}
        <div className="mb-12">
          <h3
            className="fluid-text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Hours
          </h3>
          <p className="text-sm md:text-base">
            <strong>Monday to Saturday</strong> 10.00 am to 6.30 pm IST
          </p>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {locations.map((loc) => (
            <div
              key={loc.title}
              className="border border-neutral-200 rounded-lg p-6 flex flex-col gap-3"
            >
              <h3
                className="fluid-text-base font-bold"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {loc.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                {loc.description}
              </p>
              <Link
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-sm font-medium text-black underline underline-offset-2 hover:text-neutral-500 transition-colors w-fit"
              >
                Get directions
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Map embed slot */}
        {/* TODO: embed Google Maps iframe here once the centre coordinates are confirmed */}
        <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
          Google Maps embed — TODO
        </div>
      </div>
    </section>
  );
}
