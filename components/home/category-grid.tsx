import Link from "next/link";
import { createTranslator } from "lib/i18n";
import { getLocalizedPath } from "lib/i18n";

export default function CategoryGrid({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  const categories = [
    {
      name: t("home.skateboards"),
      emoji: "🛹",
      href: "/search/skateboards",
      bgClass: "from-indigo-50/50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/30 border-indigo-100/80 dark:border-indigo-950/40 text-indigo-900 dark:text-indigo-200",
    },
    {
      name: t("home.surfskates"),
      emoji: "🌊",
      href: "/search/surfskates",
      bgClass: "from-teal-50/50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/30 border-teal-100/80 dark:border-teal-950/40 text-teal-900 dark:text-teal-200",
    },
    {
      name: t("home.apparel"),
      emoji: "👕",
      href: "/search/apparel-1",
      bgClass: "from-amber-50/50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/30 border-amber-100/80 dark:border-amber-950/40 text-amber-900 dark:text-amber-200",
    },
    {
      name: t("home.protective_gear"),
      emoji: "🪖",
      href: "/search/protection-gears",
      bgClass: "from-rose-50/50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/30 border-rose-100/80 dark:border-rose-950/40 text-rose-900 dark:text-rose-200",
    },
  ];

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-6 py-16 md:py-24">
      <h2 className="mb-10 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-100">
        {t("home.shop_by_category")}
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={getLocalizedPath(category.href, locale)}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br ${category.bgClass}`}
          >
            <span className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {category.emoji}
            </span>
            <span className="mt-4 text-base font-semibold tracking-wide md:text-lg">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
