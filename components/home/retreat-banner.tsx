import Image from "next/image";
import { createTranslator } from "lib/i18n";
import retreatBanner from "components/icons/retreat_banner.webp";
import retreatBannerMobile from "components/icons/retreat_banner_mobile.webp";

// TEMPORARY: Girl's Flow Retreat banner + registration button. Remove after the event.
export default function RetreatBanner({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <section className="w-full bg-black px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6">
        <Image
          src={retreatBannerMobile}
          alt="Girl's Flow Retreat — November 27 to 30 with Paddle Cult, Varkala, Kerala"
          className="h-auto w-full max-w-md rounded-lg md:hidden"
          sizes="(max-width: 767px) 100vw, 0px"
        />
        <Image
          src={retreatBanner}
          alt="Girl's Flow Retreat — November 27 to 30 with Paddle Cult, Varkala, Kerala"
          className="hidden h-auto w-full rounded-lg md:block"
          sizes="(min-width: 1600px) 1600px, 100vw"
        />
        <a
          href="https://payments.cashfree.com/forms/weskateco"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#CCFF02] px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:brightness-95 active:scale-95"
        >
          {t("home.retreat_register")}
        </a>
      </div>
    </section>
  );
}
