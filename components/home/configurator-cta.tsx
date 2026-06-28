import Link from "next/link";
import { createTranslator } from "lib/i18n";
import { getLocalizedPath } from "lib/i18n";

export default function ConfiguratorCTA({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-6 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 text-white shadow-xl md:px-16 md:py-20 dark:bg-black dark:border dark:border-neutral-800">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("home.configurator_cta")}
          </h2>
          <p className="mt-4 text-base text-neutral-400 md:text-lg">
            {t("home.configurator_desc")}
          </p>
          <div className="mt-8">
            <Link
              href={getLocalizedPath("/configurator", locale)}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
            >
              {t("home.build_your_setup")}
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-neutral-800 blur-3xl dark:bg-neutral-900" />
      </div>
    </section>
  );
}
