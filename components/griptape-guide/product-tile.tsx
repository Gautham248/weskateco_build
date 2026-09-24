"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image from "next/image";
import Link from "next/link";

/**
 * Range-strip product tile — Shopify CDN photo (hotlinked, already
 * whitelisted in next.config) linking to the product's store page.
 */
export default function ProductTile({
  name,
  caption,
  handle,
  image,
  alt,
}: {
  name: string;
  caption: string;
  handle: string;
  image: string;
  alt: string;
}) {
  const { locale } = useTranslation();
  const CLASH = { fontFamily: "'Clash Display', sans-serif" };

  return (
    <Link
      href={getLocalizedPath(`/product/${handle}`, locale)}
      className="group flex flex-col gap-3 h-full rounded-[16px] border border-neutral-200 bg-white p-4 transition-colors hover:border-black"
    >
      <span className="relative block w-full aspect-[4/3] overflow-hidden rounded-[8px] bg-[#F7F7F9]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </span>
      <span className="flex flex-col gap-1">
        <span
          className="text-base md:text-lg font-bold tracking-[-1%] text-black uppercase leading-[110%] group-hover:text-neutral-600 transition-colors"
          style={CLASH}
        >
          {name}
        </span>
        <span className="text-sm text-neutral-600 leading-[150%]">
          {caption}
        </span>
      </span>
    </Link>
  );
}
