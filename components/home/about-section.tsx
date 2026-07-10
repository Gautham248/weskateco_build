import Link from "next/link";
import Image from "next/image";
import aboutImg from "components/icons/about.png";

export default function AboutSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={aboutImg}
          alt="About Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay to ensure text readability against the background */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full flex-col justify-between px-6 py-16 md:flex-row md:items-end md:py-24 lg:px-12">

        {/* Left Side: Description Text */}
        <div className="max-w-md md:w-5/12 mb-8 md:mb-0">
          <h2 className="text-[8vw] font-bold leading-8 tracking-tight text-[#d4ff00] sm:text-2xl lg:text-3xl font-sans">
            We are a community driven by grit, built on persistence, and united by skateboarding.
          </h2>
        </div>

       {/* Right Side: Large Title & CTA Button Container */}
<div className="relative flex flex-col items-start md:w-7/12 md:items-end">
  <div className="relative inline-flex items-start tracking-tighter select-none">
    
    <h1 className="flex items-start text-[30vw] font-black uppercase text-[#d4ff00] sm:text-[14vw] md:text-[15vw] lg:text-[11vw] leading-[0.8] font-sans">
      {/* WE */}
      <span className="leading-[0.8]">WE</span>
      
      {/* Wrapper container for the Apostrophe + RE to establish the exact button width bounds */}
      <span className="relative inline-flex items-start">
        
        {/* Custom Apostrophe Frame */}
        <span className="inline-flex items-center justify-center w-[0.36em] h-[0.6em] mr-[-0.03em] ml-[-0.03em] translate-y-[0.05em] shrink-0 mt-[-0.02em]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" width="100%" height="100%">
            <path
              d="M 15,10 
              L 85,10 
              L 85,85 
              A 35,35 0 0,1 50,120 
              L 15,120 
              L 15,90 
              L 45,90 
              L 45,70 
              L 15,70 
              Z"
              fill="none"
              stroke="#d4ff00"
              strokeWidth="11"
              strokeLinejoin="miter"
              strokeLinecap="square"
            />
          </svg>
        </span>
        
        {/* 'RE' */}
        <span className="text-[0.60em] font-black leading-[0.8] mt-[0.04em] translate-y-[0.04em]">
          RE
        </span>

        {/* CTA Button anchored strictly inside the width of the Apostrophe + RE area */}
        <div className="absolute left-0 right-0 bottom-[-0.05em] z-20 translate-y-[100%]">
          <Link
            href="/about"
            className="group flex items-center justify-between rounded-full bg-black border border-neutral-900 px-3 py-1.5 text-[1.5vw] sm:text-[0.8vw] md:text-[1vw] font-bold tracking-widest text-[#d4ff00] uppercase transition-all duration-300 hover:bg-neutral-950 hover:border-neutral-800 w-full"
          >
            <span className="truncate">CTA BUTTON</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-nudge-x w-[1.1vw] h-[1.1vw] min-w-[10px] min-h-[10px] shrink-0"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </span>
    </h1>

  </div>
</div>
      </div>
    </section>
  );
}