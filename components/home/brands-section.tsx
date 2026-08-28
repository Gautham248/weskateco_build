import Link from "next/link";
import Image from "next/image";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import { getAuthorisedBrands, AuthorisedBrandData } from "lib/sanity/queries";

interface DisplayBrand {
  name: string;
  handle: string;
  logoUrl?: string;
}

export default async function BrandsSection({ locale }: { locale: string }) {
  const t = createTranslator(locale);
  const sanityBrands = await getAuthorisedBrands();

  const defaultBrands: DisplayBrand[] = [
    { name: "Sphere Skateboards", handle: "sphere" },
    { name: "Toucan Accessories", handle: "toucan" },
    { name: "Baker Skateboards", handle: "baker-skateboards" },
    { name: "Girl Skateboards", handle: "girl-skateboards" },
    { name: "Disorder Skateboards", handle: "disorder-skateboards" },
    { name: "MACBA Life", handle: "macba-life" },
    { name: "Wasted Angels", handle: "wasted-angels" },
    { name: "Mon Amour Nepal", handle: "mon-amour-nepal" },
  ];

  const brands: DisplayBrand[] = sanityBrands.length > 0
    ? sanityBrands.map((b: AuthorisedBrandData): DisplayBrand => ({
        name: b.name,
        handle: b.shopifyCollectionHandle || b.handle,
        logoUrl: b.logoUrl,
      }))
    : defaultBrands;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-6 py-16 md:py-24">
      <h2 className="mb-10 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-100 font-clash">
        {t("home.brands_title")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={getLocalizedPath(`/store/${brand.handle}`, locale)}
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-6 text-center text-base font-semibold text-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/35 dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={120}
                height={40}
                className="max-h-10 w-auto object-contain"
              />
            ) : (
              <span className="tracking-wide">{brand.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
