import { getLocalizedPath } from "lib/i18n";
import type { Collection } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function CollectionsGrid({
  collections,
  locale,
  title,
  description,
}: {
  collections: Collection[];
  locale: string;
  title: string;
  description: string;
}) {
  if (collections.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-16 dark:bg-neutral-900">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="mb-8 flex flex-col gap-3 md:mb-12 md:gap-4">
          <h1
            className="text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase leading-none tracking-[-1%] text-black dark:text-white"
            style={CLASH}
          >
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-[150%] text-neutral-600 md:text-lg dark:text-neutral-300">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {collections.map((collection, index) => (
            <Link
              key={collection.handle}
              href={getLocalizedPath(`/store/${collection.handle}`, locale)}
              className="group overflow-hidden rounded-[12px] border border-neutral-200 bg-white transition-colors hover:border-black dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-400"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F9] dark:bg-neutral-900">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={index < 4}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    {collection.title}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <h2
                  className="text-sm font-bold uppercase leading-[110%] tracking-[-1%] text-black transition-colors group-hover:text-neutral-600 md:text-base dark:text-white dark:group-hover:text-neutral-300"
                  style={CLASH}
                >
                  {collection.title}
                </h2>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-0.5 dark:bg-white dark:text-black">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path
                      d="M5 12H19M12 19L19 12L12 5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
