import Link from "next/link";
import Image from "next/image";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import { getSiteSettings } from "lib/sanity/queries";
import coverVid from "components/icons/cover_vid.gif";

export default async function HeroBanner({ locale }: { locale: string }) {
  const t = createTranslator(locale);
  const settings = await getSiteSettings();
  const hero = settings?.heroSettings;

  const mediaUrl = hero?.mediaUrl;
  const isVideo = hero?.mediaType === "video";
  const overlayEnabled = hero?.overlayEnabled ?? false;
  const ctaButtons = hero?.ctaButtons ?? [];

  return (
    <section className="relative h-screen w-full overflow-hidden -mt-[72px]">
      {mediaUrl ? (
        isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={mediaUrl}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            unoptimized={mediaUrl.endsWith(".gif")}
          />
        )
      ) : (
        <Image
          src={coverVid}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      {overlayEnabled && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-neutral-200 via-white to-neutral-400 bg-clip-text text-transparent">
              {t("home.hero_title")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 md:text-xl">
            {t("home.hero_subtitle")}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
            {ctaButtons.length > 0
              ? ctaButtons.map((btn: { label_en?: string; label_hi?: string; href?: string }, idx: number) => (
                  <Link
                    key={idx}
                    href={getLocalizedPath(btn.href ?? "/", locale)}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
                  >
                    {locale === "hi" ? btn.label_hi : btn.label_en}
                  </Link>
                ))
              : (
                <>
                  <Link
                    href={getLocalizedPath("/store/skateboard-completes", locale)}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
                  >
                    {t("home.shop_skateboards")}
                  </Link>
                  <Link
                    href={getLocalizedPath("/store/surfskate-completes", locale)}
                    className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/50 px-8 py-4 text-base font-semibold transition-all duration-300 hover:bg-neutral-800 hover:scale-105 active:scale-95"
                  >
                    {t("home.shop_surfskates")}
                  </Link>
                </>
              )}
          </div>
        </div>
      )}
    </section>
  );
}
