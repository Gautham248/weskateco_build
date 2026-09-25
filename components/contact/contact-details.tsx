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
    mapsUrl: "https://maps.app.goo.gl/nZY4yPC5h1buKgan6",
  },
  {
    title: "Skatepark build base — Kerala.",
    description:
      "WB Skateparks construction crew and equipment yard. Projects run across India and internationally.",
    mapsUrl: "#", // TODO: add Kerala location Google Maps URL
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
          <p className="text-neutral-600 text-sm md:text-base">
            Toucan Distribution Pvt Ltd · WB Skatepark Constructions LLP
          </p>
          <address className="not-italic text-neutral-500 text-sm md:text-base leading-relaxed">
           <br />
           No 149/3, 5th Main Rd, Malleshpalya
           Behind DS Upahara, Kaggadasapura
            <br />
            Bangalore, Karnataka 560075
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
                  href="tel:+917204593003"
                  className="text-sm md:text-base text-black underline underline-offset-2 hover:text-neutral-500 transition-colors"
                >
                  +91-72045-93003
                </a>
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

        {/* Map embed */}
        <div className="w-full rounded-lg overflow-hidden border border-neutral-200">
          <iframe
            title="WeSkate Co head office location"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBVizdQeh3udy11xDc5Ao2YStR2gLc-rfc&amp;q=12%C2%B058'44.0%22N%2077%C2%B040'24.6%22E&amp;maptype=roadmap&amp;zoom=19"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
