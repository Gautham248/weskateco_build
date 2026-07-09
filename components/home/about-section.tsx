import Link from "next/link";
import Image from "next/image";
import aboutImg from "components/icons/about.jpeg";

export default function AboutSection() {
  return (
    <section className="h-screen w-full bg-white">
      <div className="relative w-full h-full">
        <Image
          src={aboutImg}
          alt="About"
          fill
          className="object-cover object-left-top"
          priority
        />
        <Link
          href="/about"
          className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white text-sm font-semibold uppercase hover:opacity-90 transition-opacity"
        >
          KNOW MORE
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
