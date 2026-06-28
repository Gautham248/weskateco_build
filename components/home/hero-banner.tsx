import Link from "next/link";
import { createTranslator } from "lib/i18n";
import { getLocalizedPath } from "lib/i18n";

export default function HeroBanner({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <section className="relative overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black py-20 text-white md:py-32">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 text-center">
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
            href={getLocalizedPath("/search/skateboard-completes", locale)}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
          >
            {t("home.shop_skateboards")}
          </Link>
          <Link
            href={getLocalizedPath("/search/surfskate-completes", locale)}
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
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
    </section>
  );
}
