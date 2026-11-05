"use client";

import { localizeHref } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Drop-in for `next/link` on storefront pages: internal hrefs keep the
 * shopper's language, so a hardcoded `href="/academy"` goes to /hi/academy on a
 * Hindi page instead of quietly switching them back to English. Import it as
 * `Link` in place of next/link. Hrefs that already carry a locale (for example
 * from getLocalizedPath), external URLs and non-storefront paths pass through
 * unchanged — see `localizeHref`.
 */
export default function Link({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  const { locale } = useTranslation();

  const localized =
    typeof href === "string"
      ? localizeHref(href, locale)
      : href.pathname
        ? { ...href, pathname: localizeHref(href.pathname, locale) }
        : href;

  return <NextLink href={localized} {...props} />;
}
