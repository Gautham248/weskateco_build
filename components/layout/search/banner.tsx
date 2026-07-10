import skateboardsBanner from "components/icons/skateboards_banner.png";
import Image from "next/image";

interface StoreBannerProps {
  title: string;
  description?: string;
}

export default function StoreBanner({ title, description }: StoreBannerProps) {
  // Try to load collection-specific image, fall back to default
  let bannerImg = skateboardsBanner;
  try {
    bannerImg = require(`components/icons/${title.toLowerCase()}_banner.png`);
  } catch (e) {
    // Use default skateboard_banner if image not found
    bannerImg = skateboardsBanner;
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-0 py-12">
        <div className="relative w-full aspect-[5/1] max-[500px]:aspect-square max-[780px]:aspect-[4/1] overflow-hidden rounded-xl">
          <Image
            src={bannerImg}
            alt={`${title} banner`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col max-[500px]:justify-end justify-center items-start p-8 md:p-12 text-white bg-gradient-to-t from-black/60 to-transparent">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {title.toUpperCase()}
            </h1>
            {description && (
              <p className="mt-2 max-w-3xl text-sm text-white md:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
