import apparelBanner from "components/icons/apparel_banner.png";
import apparelBannerMobile from "components/icons/apparel_banner_mobile.jpg";
import skateboardsBanner from "components/icons/skateboards_banner.png";
import skateboardsBannerMobile from "components/icons/skateboards_banner_mobile.jpg";
import surfskatesBanner from "components/icons/surfskates_banner.png";
import surfskatesBannerMobile from "components/icons/surfskates_banner_mobile.jpg";
import { getLocalizedPath } from "lib/i18n";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface StoreBannerProps {
  title: string;
  description?: string;
  handle?: string;
  locale?: string;
}

export default function StoreBanner({
  title,
  description,
  handle,
  locale = "en",
}: StoreBannerProps) {
  const key = (handle || title || "").toLowerCase();
  let desktopImg: StaticImageData = skateboardsBanner;
  let mobileImg: StaticImageData = skateboardsBannerMobile;

  if (key.includes("surfskate")) {
    desktopImg = surfskatesBanner;
    mobileImg = surfskatesBannerMobile;
  } else if (key.includes("apparel")) {
    desktopImg = apparelBanner;
    mobileImg = apparelBannerMobile;
  } else {
    desktopImg = skateboardsBanner;
    mobileImg = skateboardsBannerMobile;
  }

  return (
    <section className="w-full bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-0 pt-2 pb-6 md:py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex items-center gap-1.5 text-xs md:text-sm text-neutral-500 dark:text-neutral-400"
        >
          <Link
            href={getLocalizedPath("/", locale)}
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            Home
          </Link>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400 shrink-0"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link
            href={getLocalizedPath("/store", locale)}
            className={`transition-colors hover:text-black dark:hover:text-white ${!handle ? "font-medium text-neutral-900 dark:text-neutral-100" : ""}`}
          >
            Store
          </Link>
          {handle && (
            <>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400 shrink-0"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                {title}
              </span>
            </>
          )}
        </nav>

        {/* Banner Card */}
        <div className="relative w-full aspect-[5/4] md:aspect-[4/1] lg:aspect-[5/1] overflow-hidden rounded-2xl">
          <Image
            src={desktopImg}
            alt={`${title} banner`}
            fill
            className="hidden md:block object-cover object-center"
            priority
          />
          <Image
            src={mobileImg}
            alt={`${title} banner`}
            fill
            className="block md:hidden object-cover object-center"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end items-start p-5 sm:p-6 md:p-12 text-white bg-gradient-to-t from-black/75 via-black/30 to-transparent">
            <h1
              className="text-2xl sm:text-3xl md:text-[clamp(1.5rem,5vw,3.75rem)] font-bold tracking-[-1%] text-white leading-[100%] uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 md:mt-2 max-w-xl md:max-w-3xl text-xs sm:text-sm md:text-lg text-white/90 leading-snug md:leading-normal">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
