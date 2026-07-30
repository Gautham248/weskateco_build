"use client";

import aboutImg from "components/icons/about.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-auto aspect-square md:h-screen md:aspect-auto w-full overflow-hidden bg-black select-none"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={aboutImg}
          alt="About Background"
          fill
          className="object-cover object-[43.5%_center] md:object-center"
          priority
        />
        {/* Dark overlay to ensure text readability against the background */}
        <div className="absolute inset-0 bg-black/40" />

        {/* SVG Drawing Animation Overlay */}
        <svg
          viewBox="0 0 1082 716"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute top-0 left-[20%] right-0 w-[80%] h-[75%] overflow-visible pointer-events-none z-10 ${isInView ? "animate-path" : ""
            }`}
          preserveAspectRatio="none"
        >
          <style>{`
            #drawing-path {
              /* 2000 is a safe estimate above the actual path length */
              stroke-dasharray: 2000;
              stroke-dashoffset: 2000;
            }

            .animate-path #drawing-path {
              animation: drawLine 2.5s ease-out forwards;
            }

            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}</style>

          <path
            id="drawing-path"
            d="M1 -0.267578C1 394.54 321.055 714.596 715.863 714.596H1082"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="paint0_linear_3254_912"
              x1="16.194"
              y1="98.9013"
              x2="539.496"
              y2="715.994"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3C3C3C" />
              <stop offset="1" stopColor="#999999" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 h-full md:h-auto md:absolute md:bottom-0 md:left-0 md:right-0 flex flex-row items-end md:items-center justify-between pb-8 pt-12 md:py-24">
        {/* Left Side: Description Text */}
        <div className="max-w-[45%] mb-0 md:max-w-md md:w-5/12">
          <h2
            className="md:hidden font-normal leading-tight tracking-tight text-[#d4ff00] text-xs sm:text-xs text-balance"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            We are a community driven by grit, built on persistence, and united
            by skateboarding.
          </h2>
          <h2
            className="hidden md:block font-bold leading-[40px] tracking-tight text-[#d4ff00] lg:fluid-text-3xl text-4xl"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            We are a community driven by grit, built on persistence, and united
            by skateboarding.
          </h2>
        </div>

        {/* Right Side: Large Title & CTA Button Container */}
        <div className="relative flex flex-col items-end w-[50%] md:w-7/12">
          <div className="relative inline-block tracking-tighter select-none w-full max-w-[575px]">
            {/* SVG replacing WE'RE text */}
            <svg
              width="575"
              height="132"
              viewBox="0 0 575 132"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M405.458 1.26465V48.3271C405.458 60.2127 401.947 68.8452 395.594 74.5264C389.217 80.2293 379.781 83.1348 367.586 83.1348H352.575V58.2969H366.173C369.049 58.2968 371.544 57.8961 373.272 56.2812C375.017 54.6494 375.671 52.0764 375.671 48.5625V44.0137H350.454V1.26465H405.458Z"
                stroke="#CCFF02"
                strokeWidth="2.5"
              />
              <path
                d="M436.08 83.2547H412.719V0H461.304C483.299 0 494.855 9.1953 494.855 25.4734C494.855 38.6451 488.269 46.4735 472.364 48.4617V49.7043C480.938 51.941 483.671 56.0416 486.778 62.3789L497.092 83.2547H470.127L460.186 62.8759C457.204 56.6629 454.719 54.9232 445.648 54.9232H436.08V83.2547ZM436.08 21.0001V37.5267H461.056C467.89 37.5267 470.375 36.2841 470.375 29.2013C470.375 22.6155 467.89 21.0001 461.056 21.0001H436.08Z"
                fill="#CCFF02"
              />
              <path
                d="M574.753 83.2547H500.817V0H574.753V21.0001H524.178V30.9409H572.889V51.8167H524.178V62.2546H574.753V83.2547Z"
                fill="#CCFF02"
              />
              <path
                d="M82.5427 132.002H27.5799L0 0.012207H41.3699L52.4018 67.189L55.9478 96.9359H58.5088L63.8278 67.189L81.5577 0.012207H137.309L153.462 67.189L158.19 96.9359H160.751L164.691 67.189L177.102 0.012207H217.684L187.543 132.002H132.581L118.791 75.463L110.123 34.0931H107.562L98.3027 75.463L82.5427 132.002Z"
                fill="#CCFF02"
              />
              <path
                d="M342.591 132.002H225.376V0.012207H342.591V33.3051H262.412V49.065H339.636V82.1609H262.412V98.7089H342.591V132.002Z"
                fill="#CCFF02"
              />
            </svg>

            {/* CTA Button positioned inside the SVG empty space under 'RE */}
            <div className="absolute left-[60.9%] right-0 bottom-[-2%] z-20 h-[30%]">
              <Link
                href="/about"
                className="group flex items-center justify-between rounded-full bg-black border border-neutral-900 px-3 md:px-5 text-[6px] sm:text-[clamp(0.5rem,0.8vw,0.875rem)] md:text-[clamp(0.625rem,1vw,1rem)] font-bold tracking-widest text-[#d4ff00] uppercase transition-all duration-300 hover:bg-neutral-950 hover:border-neutral-800 w-full h-full"
              >
                <svg
                  className="h-[0.9em] w-auto shrink-0 max-w-[70%]"
                  viewBox="0 0 1255 165"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1020.27 0.336923C1035.59 -1.54895 1061.89 4.66805 1073.74 14.3324C1087.97 25.9513 1093.1 36.0909 1095.65 53.6624C1105.48 21.4409 1124.65 5.44636 1158.42 1.12896C1181.62 -1.838 1209.72 1.69167 1228.55 16.2967C1261.35 41.7378 1262.52 106.96 1238.27 138.51C1224.77 156.055 1204.53 161.758 1183.34 164.203C1157.95 165.141 1132.19 162.363 1113.19 143.106C1103.61 133.398 1099.73 123.555 1095.66 110.939C1094.14 122.979 1090.67 133.654 1082.48 142.942C1057.64 171.095 997.583 171.102 970.051 147.279C951.985 130.987 947.4 107.558 947.035 84.5042C946.232 33.6874 968.062 3.47715 1020.27 0.336923ZM1027.09 28.4854C1025.4 28.4089 1021.67 28.376 1020.11 28.7472C982.473 32.2565 981.01 64.9608 982.958 95.5287C983.699 107.138 988.03 120.275 997.276 127.863C1010.96 138.965 1036.39 139 1050.66 129.131C1059.46 121.925 1063.03 113.505 1062.92 102.075H1094.21C1092.46 92.2789 1091.98 72.6965 1094.11 62.892H1061.7C1060.16 41.5797 1049.65 29.5059 1027.09 28.4854ZM1219 69.7241C1215.86 39.3736 1196.92 26.986 1167.86 28.6979C1129.52 33.3896 1125.94 63.6283 1128.77 96.3485C1131.28 125.441 1153.3 139.343 1181.17 135.787L1181.48 135.745C1216.57 131.936 1222.05 99.0615 1219 69.7241Z"
                    fill="#CCFF02"
                  />
                  <path
                    d="M163.875 3.013L300.974 3.01161L296.027 31.2908H220.7V66.6839H289.956C288.239 75.9906 286.571 85.3054 284.951 94.6296H220.7V133.204H278.351C276.467 142.302 274.944 152.439 273.208 161.699H186.102L186.113 78.2839C186.116 65.7812 186.711 45.487 185.801 33.4205C182.846 47.481 180.37 63.5261 177.843 77.7786L162.939 161.699H123.827C120.968 150.789 118.557 138.63 115.927 127.551C109.113 98.8531 102.919 69.8358 95.8956 41.2049C92.6612 53.3886 89.7635 67.8053 86.9513 80.2135L68.4 161.699H28.0659C25.7864 145.091 21.4981 124.228 18.5227 107.425L0 3.01358L30.3542 3.013C32.2082 10.6692 34.0107 23.0959 35.4304 31.0964L45.3468 87.1126C47.1944 97.5506 49.0449 109.593 51.3551 119.755C53.5699 107.113 57.1946 92.0827 59.9183 79.3821L76.3357 3.013H117.386C122.365 27.4489 128.514 52.5834 133.716 77.0813C135.74 86.6143 140.668 111.481 143.356 119.464C145.108 106.856 148.109 91.976 150.349 79.2905L163.875 3.013Z"
                    fill="#CCFF02"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M487.622 2.99611C486.081 9.40828 484.538 19.8417 483.323 26.6547L475.088 72.8745C483.327 66.1691 493.913 55.906 501.922 48.5915L551.867 2.99611H597.065L525.36 67.5166C535.401 89.3028 546.263 111.39 556.585 133.124C564.791 119.425 573.367 103.095 581.243 88.9447L629.073 2.99611H671.513C673.357 13.3008 675.96 24.6673 678.094 35.0079C680.876 46.8968 683.333 60.159 685.843 72.2665L704.498 161.699H669.252C667.049 152.736 664.955 139.835 663.151 130.502H593.774L576.935 161.698C561.668 161.908 546.402 161.908 531.14 161.699L498.815 91.2075C488.538 99.1444 477.842 108.12 467.682 116.329L459.608 161.699H425.083C433.612 109.309 443.925 55.4087 453.137 2.99611H487.622ZM644.755 32.8788C642.072 37.7485 639.435 43.073 637.087 48.1173C628.413 66.7366 617.842 84.4386 608.584 102.728H657.836C654.818 86.7691 651.909 70.79 649.104 54.7919C648.514 51.3236 646.265 34.8151 644.755 32.8788Z"
                    fill="#CCFF02"
                  />
                  <path
                    d="M690.486 2.99704L952.124 2.99362C950.302 12.3954 948.753 21.8342 946.879 31.2664H855.291C852.966 41.6006 850.901 55.9349 849.022 66.6554H930.415C928.813 75.9854 927.16 85.3066 925.454 94.6174H843.91C841.875 107.423 839.469 120.438 837.237 133.231L929.01 133.233C928.276 137.471 927.836 139.65 926.5 143.715C921.805 153.012 912.645 160.632 901.947 161.322C891.433 161.999 880.405 161.671 869.84 161.678L797.567 161.683C805.882 118.852 812.411 74.8848 820.692 31.9527H770.59C768.791 44.1515 766.131 57.1224 764.049 69.4013C758.839 100.147 752.946 130.931 747.909 161.695H713.201C721.494 119.572 728.549 74.5106 736.089 31.9527H685.397C687.016 22.2874 688.716 12.6351 690.486 2.99704Z"
                    fill="#CCFF02"
                  />
                  <path
                    d="M346.319 3.2016C348.259 2.78986 370.504 2.94488 374.009 2.94616L444.525 2.99239L439.548 31.4503L382.158 31.4486C372.699 31.4509 363.143 31.1243 353.673 31.9701C346.932 32.5729 339.819 39.7244 341.129 46.7465C342.596 54.6185 353.591 59.0033 359.898 62.6385C376.907 72.2208 393.402 78.0652 409.955 88.7765C430.983 102.383 429.013 126.224 416.791 145.445C410.736 154.968 400.23 159.613 389.231 161.471C382.175 162.223 363.715 161.736 356.07 161.734L290.202 161.699C291.957 152.204 293.625 142.694 295.206 133.168L351.542 133.137C360.679 133.137 370.065 133.556 379.174 132.954C392.222 132.092 399.255 117.923 387.253 109.424C379.899 104.217 371.222 100.949 363.25 96.7767C339.179 83.9108 302.177 74.4254 309.734 39.1019C314.082 18.7764 324.843 5.66885 346.319 3.2016Z"
                    fill="#CCFF02"
                  />                </svg>
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
          </div>
        </div>
      </div>
    </section>
  );
}
