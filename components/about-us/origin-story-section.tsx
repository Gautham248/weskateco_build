export default function OriginStorySection() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
          <div
            aria-hidden
            className="w-full aspect-square rounded-[8px] bg-[#d9d9d9]"
          />

          <p
            className="text-base md:text-xl lg:text-2xl font-medium text-black leading-[130%] tracking-[-0.01em]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Indian skateboarding is young, and it grew out of cracked tar,
            borrowed boards and parks poured by volunteers. Auroville had
            surfing, skateboarding and a concrete mini ramp early on, and in
            2006 a small bowl went up in Goa. The Holystoked crew formed in
            Bengaluru in 2010. In 2013 Holystoked, Make Life Skate Life and 34
            volunteers built India&apos;s first free public park, and that is
            where it all started properly. The park went viral, people began to
            take skateboarding seriously, and skaters came from all over the
            world for the Third Eye tour and the Holy Detour skate trip.
          </p>
        </div>
      </div>
    </section>
  );
}
