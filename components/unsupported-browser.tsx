import { createTranslator } from "lib/i18n";

/**
 * Shown instead of the site in browsers below our support floor.
 * Visibility is handled purely in CSS (see "Unsupported-browser fallback" in
 * globals.css), so it works even where our JavaScript can't run.
 */
export function UnsupportedBrowserMessage({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <div className="unsupported-browser" data-nosnippet>
      <h1>{t("unsupported_browser.title")}</h1>
      <p>{t("unsupported_browser.body")}</p>
    </div>
  );
}
