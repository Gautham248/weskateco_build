import classroomImg from "components/icons/school/classroom.png";
import Image from "next/image";

export default function ClassroomSection() {
  return (
    <section className="relative w-full bg-white h-auto md:min-h-screen md:h-screen md:max-h-screen py-6 md:py-[120px] flex flex-col justify-between overflow-hidden">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 h-full flex flex-col justify-between flex-1 min-h-0">
        <div className="relative flex flex-col justify-between h-full min-h-0">
          {/* Top Heading: Overlaps top-left of image on desktop with mix-blend-difference */}
          <div className="relative z-20 shrink-0 max-w-full sm:max-w-[85%] md:max-w-[78%] lg:max-w-[72%] md:mix-blend-difference pointer-events-none mb-[24px] md:mb-0">
            <h2
              className="text-[clamp(24px,4.2vw,60px)] font-bold tracking-tight uppercase leading-[0.93] text-black md:text-white select-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              WHAT IF INDIA&apos;S NEXT
              <br />
              OLYMPIC SKATEBOARDER
              <br />
              IS SITTING IN YOUR
              <br />
              CLASSROOM?
            </h2>
          </div>

          {/* Central Image Card: Shifted up under lines 3 & 4 of heading on desktop */}
          <div className="relative z-10 flex-1 min-h-0 w-full max-w-4xl mx-auto flex items-center justify-center mt-0 sm:-mt-12 md:-mt-18 lg:-mt-22 my-auto">
            <div className="relative max-h-full max-w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm">
              <Image
                src={classroomImg}
                alt="Classroom skateboarding"
                className="w-full h-auto md:w-auto md:h-auto md:max-h-[42vh] lg:max-h-[48vh] object-contain rounded-[16px]"
                priority
              />
            </div>
          </div>

          {/* Bottom Right Paragraph: Exactly 18px below classroom image */}
          <div className="relative z-20 shrink-0 w-full flex justify-end mt-[18px]">
            <p
              className="max-w-md lg:max-w-[560px] text-black text-sm md:text-xl leading-[18px] md:leading-[100%] font-[400]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Skateboarding is one of the world&apos;s fastest-growing Olympic
              sports, but in India, access to structured coaching remains
              limited. WeSkate Co bridges that gap by bringing a professionally
              designed curriculum directly into schools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
