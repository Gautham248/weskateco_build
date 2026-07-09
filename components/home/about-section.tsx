import Image from "next/image";
import aboutImg from "components/icons/about.jpeg";

export default function AboutSection() {
  return (
    <section className="h-screen w-full bg-white">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 h-full">
        <div className="relative w-full h-full">
          <Image
            src={aboutImg}
            alt="About"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
