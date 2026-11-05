"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { defaultLocale, locales } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { usePathname, useSearchParams } from "next/navigation";

/** Each language named in itself, as shoppers look for it. */
export const localeNames: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
};

/** Short label for the collapsed header button. */
const localeShortNames: Record<string, string> = {
  en: "EN",
  hi: "हिं",
};

/**
 * The current page's URL in `targetLocale`: English is unprefixed, other
 * locales live under /<locale>. The query string is kept so a filtered store
 * page or a selected variant survives the switch.
 */
export function useLocalizedHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (targetLocale: string) => {
    let path = pathname || "/";
    for (const locale of locales) {
      if (path === `/${locale}`) {
        path = "/";
        break;
      }
      if (path.startsWith(`/${locale}/`)) {
        path = path.slice(locale.length + 1);
        break;
      }
    }

    const prefixed =
      targetLocale === defaultLocale
        ? path
        : `/${targetLocale}${path === "/" ? "" : path}`;
    const query = searchParams?.toString();

    return query ? `${prefixed}?${query}` : prefixed;
  };
}

/**
 * Header language dropdown. Options are plain links, not client navigations:
 * the locale is the root layout's segment (it sets <html lang> and the
 * fonts), so switching loads the page fresh, and the proxy records the choice
 * for the cart.
 */
export function LanguageSwitcher({ scrolled = false }: { scrolled?: boolean }) {
  const { t, locale } = useTranslation();
  const localizedHref = useLocalizedHref();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label={`${t("nav.language")}: ${localeNames[locale]}`}
        className={`flex h-7 items-center gap-1 rounded-md text-sm font-semibold transition-colors focus:outline-none data-[focus]:ring-2 data-[focus]:ring-current ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        <GlobeAltIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
        <span>{localeShortNames[locale]}</span>
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      </MenuButton>

      <MenuItems
        anchor={{ to: "bottom end", gap: 8 }}
        className="z-50 w-40 rounded-md border border-neutral-200 bg-white py-1 text-black shadow-lg focus:outline-none dark:border-neutral-800 dark:bg-black dark:text-white"
        style={{ fontFamily: "Archivo, sans-serif" }}
      >
        {locales.map((option) => {
          const isCurrent = option === locale;

          return (
            <MenuItem key={option}>
              <a
                href={localizedHref(option)}
                hrefLang={option}
                lang={option}
                aria-current={isCurrent ? "true" : undefined}
                className="flex items-center justify-between px-4 py-2 text-sm data-[focus]:bg-neutral-100 dark:data-[focus]:bg-neutral-900"
              >
                <span className={isCurrent ? "font-semibold" : undefined}>
                  {localeNames[option]}
                </span>
                {isCurrent && (
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </a>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
