import { HeroMedia } from "components/home/hero-media";
import { HERO_FALLBACK_SLIDE, type HeroSlide } from "lib/catalog/hero";
import { getHero } from "lib/catalog/hero-feed";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import Link from "next/link";

export default async function HeroBanner({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  const hero = await getHero();

  // A failed read - a database blip, or a deploy that landed before the migration
  // ran - falls back to the built-in slide rather than blanking the homepage.
  // Only a list the admin emptied on purpose hides the section.
  const slides: HeroSlide[] =
    hero.status === "failed" ? [HERO_FALLBACK_SLIDE] : hero.slides;

  if (slides.length === 0) {
    return null;
  }

  return (
    <>
      {/*
        Kept exactly as it was found: still commented out, still not rendered.
        hero-media.tsx now owns the section and the dark overlay, so reviving this
        copy means moving it there. createTranslator, getLocalizedPath and Link
        are still imported so uncommenting it works as-is.

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-neutral-200 via-white to-neutral-400 bg-clip-text text-transparent">
              {t("home.hero_title")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 md:text-xl">
            {t("home.hero_subtitle")}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href={getLocalizedPath("/store/skateboard-completes", locale)}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
            >
              {t("home.shop_skateboards")}
            </Link>
            <Link
              href={getLocalizedPath("/store/surfskate-completes", locale)}
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/50 px-8 py-4 text-base font-semibold transition-all duration-300 hover:bg-neutral-800 hover:scale-105 active:scale-95"
            >
              {t("home.shop_surfskates")}
            </Link>
            <Link
              href={getLocalizedPath("/configurator", locale)}
              className="inline-flex items-center justify-center rounded-full border border-teal-500/30 bg-teal-950/20 px-8 py-4 text-base font-semibold text-teal-400 transition-all duration-300 hover:bg-teal-900/30 hover:scale-105 active:scale-95"
            >
              {t("home.build_your_setup")}
            </Link>
          </div>
        </div>
      */}
      <HeroMedia slides={slides} />
    </>
  );
}
