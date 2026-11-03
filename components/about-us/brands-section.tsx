import sphereIcon from "components/icons/about_us/about_us_brand_sphere.png";
import toucanIcon from "components/icons/about_us/about_us_brand_toucan.png";
import weskateIcon from "components/icons/about_us/about_us_brand_weskateco.png";
import toucanSlogan from "components/icons/about_us/about_us_toucan_slogan.png";
import Image from "next/image";

const BRANDS: {
  name: string;
  body: string;
  icon?: typeof sphereIcon;
  initials?: string;
}[] = [
  {
    name: "Sphere Skateboards",
    body: "Our skateboard brand. Decks, completes and surfskates, with graphics by Indian artists and one French artist. Meet them in our Artists section.",
    icon: sphereIcon,
  },
  {
    name: "WeSkateCo",
    body: "This shop, and WeSkate Academy, our skate school. We coach at Malleshpalya and Cubbon Park in Bengaluru, and in schools as a PE elective.",
    icon: weskateIcon,
  },
  {
    name: "Toucan Distribution",
    body: "The hardware. Trucks, wheels, bearings, tools and portable ramps.",
    icon: toucanIcon,
  },
  {
    name: "WB Skateparks",
    body: "We design and build world class skateparks in India and around the world. More than 35 parks, from the indoor park at Tokha to ProtoVillage in Andhra Pradesh and Varkala in Kerala.",
    initials: "WB",
  },
];

export default function BrandsSection() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 [container-type:inline-size] lg:px-15">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,var(--color-toucan-panel-1)_0%,var(--color-toucan-panel-2)_45%,var(--color-toucan-panel-3)_100%)] pt-[3.7cqw] pb-[4cqw] [container-type:inline-size] md:rounded-[40px]">
          <div className="mx-auto w-[92cqw] md:w-[85cqw]">
            <Image
              src={toucanSlogan}
              alt="Toucan exists to fix what we can reach"
              sizes="90vw"
              className="h-auto w-full"
            />
          </div>

          <div className="mt-[8.9cqw] px-[4cqw]">
            <div className="grid grid-cols-1 gap-[2.2cqw] md:grid-cols-2">
              {BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  className="relative flex aspect-[3.4/1] items-center overflow-hidden rounded-full border-2 border-toucan [container-type:inline-size]"
                >
                  <div className="relative ml-[3cqw] flex aspect-square w-[23cqw] shrink-0 items-center justify-center overflow-hidden rounded-full bg-toucan">
                    {brand.icon ? (
                      <Image
                        src={brand.icon}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className="font-bold text-white [font-size:9cqw] [word-spacing:0.05em]"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {brand.initials}
                      </span>
                    )}
                  </div>

                  <div className="ml-[6cqw] mr-[11cqw] min-w-0">
                    <h3
                      className="text-[3.6cqw] font-bold uppercase text-white [word-spacing:0.15em]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {brand.name}
                    </h3>
                    <p
                      className="mt-[0.4em] text-[2.4cqw] leading-[1.25] text-[#ececec] [word-spacing:0.15em]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {brand.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
