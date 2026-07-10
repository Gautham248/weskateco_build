import Link from "next/link";
import Image from "next/image";
import academyImg from "components/icons/academy.png";

export default function AcademySection() {
  return (
    <section className="h-screen w-full bg-white">
      <div className="relative w-full h-full">
        <Image
          src={academyImg}
          alt="Academy"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Top Right Text Overlay */}
        <div className="absolute top-8 left-6 md:top-12 md:left-12 z-10 text-right select-none">
          <h2 className="text-[10vw] font-black tracking-tighter text-cyan-400 italic leading-none drop-shadow-md">
            WESKATE
          </h2>
          <p className="text-[5vw] font-extrabold tracking-widest text-cyan-400 uppercase leading-none mt-1 drop-shadow-sm">
            ACADEMY
          </p>
        </div>

        {/* Link Button */}
        <Link
          href="/academy"
          className="group absolute bottom-25 md:bottom-5 left-4 z-10 flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white text-sm font-semibold uppercase hover:opacity-90 transition-opacity"
        >
          KNOW MORE
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-nudge-x"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
}