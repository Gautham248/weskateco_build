import { createTranslator, defaultLocale } from "lib/i18n";

/**
 * Shown above a translated policy: the translation is a convenience and the
 * English text is the one that applies. The link is a plain <a>, not the
 * localized Link, so it really goes to the English page.
 */
export function EnglishVersionNotice({
  locale,
  englishPath,
}: {
  locale: string;
  englishPath: string;
}) {
  if (locale === defaultLocale) {
    return null;
  }

  const t = createTranslator(locale);

  return (
    <p className="mb-8 rounded-lg border border-neutral-200 bg-neutral-100 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-800">
      {t("legal.translation_notice")}{" "}
      <a
        href={englishPath}
        hrefLang="en"
        className="font-semibold underline underline-offset-2"
      >
        {t("legal.read_english")}
      </a>
    </p>
  );
}
