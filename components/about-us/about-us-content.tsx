"use client";

import aboutBannerImg from "components/icons/about_us/about_us_banner.png";
import Image from "next/image";

export default function AboutUsContent() {
  return (
    <div className="w-full flex flex-col">
      <section className="relative h-screen w-full overflow-hidden bg-black select-none flex flex-col justify-center md:justify-end -mt-[72px]">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={aboutBannerImg}
            alt="About Us Banner"
            fill
            className="object-cover object-[calc(55%)_center] md:object-center"
            priority
          />
        </div>
      </section>
    </div>
  );
}
