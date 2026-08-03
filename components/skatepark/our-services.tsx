"use client";

import services1 from "components/icons/skatepark/services1.png";
import services2 from "components/icons/skatepark/services2.png";
import services3 from "components/icons/skatepark/services3.png";
import Image from "next/image";

const SERVICES = [
  {
    id: "consultation",
    title: "CONSULTATION",
    description:
      "Engaging with communities to ensure skatepark projects meet local needs, safety standards, and accessibility requirements.",
    image: services1,
    alt: "Skatepark consultation and planning",
  },
  {
    id: "design",
    title: "DESIGN",
    description:
      "Creating unique, functional, and aesthetically pleasing skatepark designs that offer fun and challenge in a supportive environment.",
    image: services2,
    alt: "Skatepark architectural design and blueprints",
  },
  {
    id: "construction",
    title: "CONSTRUCTION",
    description:
      "Bringing designs to life with precision, ensuring safety, durability, and an enjoyable experience for all users.",
    image: services3,
    alt: "Skatepark concrete construction",
  },
];

export default function OurServicesSection() {
  return (
    <section className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden">
      {/* Header Block aligned to standard max-width container */}
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 mb-8 md:mb-12">
        <div className="flex flex-col gap-4 max-w-[600px]">
          <h2
            className="text-[24px] md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            OUR SERVICES
          </h2>
          <p
            className="text-sm md:text-lg leading-[120%] text-black font-[400]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            From concept and planning to construction and maintenance, we
            deliver complete skatepark solutions tailored to every community.
          </p>
        </div>
      </div>

      {/* Services 3-Card Grid */}
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[24px] items-stretch">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group relative w-full aspect-[542/655] rounded-[8px] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm"
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none transition-opacity duration-300" />

              {/* Card Text Content (Title sits right above padding initially, slides up on hover with description coming up through padding) */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end text-white z-10">
                <div className="transform transition-all duration-500 ease-out translate-y-0 md:translate-y-[calc(100%-28px)] md:group-hover:translate-y-0">
                  <h3
                    className="text-xl md:text-[28px] font-bold tracking-[-1%] text-white uppercase leading-none pb-2 md:pb-3"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm md:text-lg text-white leading-[110%] font-[400] transition-opacity duration-500 ease-out opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
