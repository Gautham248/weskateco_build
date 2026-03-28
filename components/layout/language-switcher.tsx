"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "lib/i18n/TranslationProvider";

const localeNames: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale: currentLocale } = useTranslation();

  function getLocalizedPath(targetLocale: string): string {
    // Remove current locale prefix if present
    let path = pathname;
    const locales = ["en", "hi"];
    for (const loc of locales) {
      if (path.startsWith(`/${loc}/`)) {
        path = path.substring(loc.length + 1);
        break;
      } else if (path === `/${loc}`) {
        path = "/";
        break;
      }
    }

    // For default locale (en), use clean URL (no prefix)
    if (targetLocale === "en") {
      return path || "/";
    }

    // For other locales, add prefix
    return `/${targetLocale}${path}`;
  }

  const targetLocale = currentLocale === "en" ? "hi" : "en";

  return (
    <a
      href={getLocalizedPath(targetLocale)}
      className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      aria-label={`Switch to ${localeNames[targetLocale]}`}
    >
      {localeNames[targetLocale]}
    </a>
  );
}
