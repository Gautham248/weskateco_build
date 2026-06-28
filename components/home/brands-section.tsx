import Link from "next/link";
import { createTranslator } from "lib/i18n";
import { getLocalizedPath } from "lib/i18n";

export default function BrandsSection({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  const brands = [
    { name: "Sphere Skateboards", handle: "sphere" },
    { name: "Toucan Accessories", handle: "toucan" },
    { name: "Baker Skateboards", handle: "baker-skateboards" },
    { name: "Girl Skateboards", handle: "girl-skateboards" },
    { name: "Disorder Skateboards", handle: "disorder-skateboards" },
    { name: "MACBA Life", handle: "macba-life" },
    { name: "Wasted Angels", handle: "wasted-angels" },
    { name: "Mon Amour Nepal", handle: "mon-amour-nepal" },
  ];

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-6 py-16 md:py-24">
      <h2 className="mb-10 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-100">
        {t("home.brands_title")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={getLocalizedPath(`/search/${brand.handle}`, locale)}
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-6 text-center text-base font-semibold text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/35 dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            <span className="tracking-wide">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
