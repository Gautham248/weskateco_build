"use client";

import fb from "components/icons/fb.svg";
import insta from "components/icons/insta.svg";
import yt from "components/icons/yt.svg";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [shopOpen, setShopOpen] = useState(true);

  return (
    <footer className="bg-black text-white w-full font-sans antialiased selection:bg-white selection:text-black">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 pt-16 pb-10 md:pt-25">
        {/* DESKTOP TOP SECTION: Link Columns */}
        <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-24 mb-30">
          {/* Column 1: Shop Categories */}
          <div>
            <h3
              className="font-bold text-[clamp(0.75rem,2vw,1rem)] tracking-widest text-white mb-4 uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Shop
            </h3>
            <ul
              className="space-y-3 text-neutral-400 text-[clamp(0.75rem,2vw,1rem)] font-normal"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              <li>
                <Link
                  href="/store/skateboards"
                  className="hover:text-white transition-colors"
                >
                  Skateboards
                </Link>
              </li>
              <li>
                <Link
                  href="/store/surfskates"
                  className="hover:text-white transition-colors"
                >
                  Surfskates
                </Link>
              </li>
              <li>
                <Link
                  href="/store/apparel"
                  className="hover:text-white transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/store/protection-gears"
                  className="hover:text-white transition-colors"
                >
                  Protective Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Info Links */}
          <div
            className="flex flex-col space-y-4 font-bold text-[clamp(0.75rem,2vw,1rem)] tracking-wider text-white"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            <Link
              href="/academy"
              className="hover:text-neutral-300 transition-colors"
            >
              ACADEMY
            </Link>
            <Link
              href="/about"
              className="hover:text-neutral-300 transition-colors"
            >
              ABOUT US
            </Link>
            <Link
              href="/guides"
              className="hover:text-neutral-300 transition-colors"
            >
              BUYING GUIDES
            </Link>
            <Link
              href="/blogs"
              className="hover:text-neutral-300 transition-colors"
            >
              BLOGS
            </Link>
            <Link
              href="/stores"
              className="hover:text-neutral-300 transition-colors"
            >
              STORES
            </Link>
          </div>

          {/* Column 3: Legal & Support Links */}
          <div
            className="hidden md:flex flex-col space-y-4 font-bold text-[clamp(0.75rem,2vw,1rem)] tracking-wider text-white"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            <Link
              href="/contact"
              className="hover:text-neutral-300 transition-colors"
            >
              CONTACT US
            </Link>
            <Link
              href="/shipping-policy"
              className="hover:text-neutral-300 transition-colors"
            >
              SHIPPING POLICY
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-neutral-300 transition-colors"
            >
              PRIVACY POLICY
            </Link>
          </div>
        </div>

        {/* MOBILE TOP SECTION: Accordion Menu */}
        <div
          className="md:hidden flex flex-col mb-10 w-full"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {/* SHOP Accordion */}
          <div className="border-b border-neutral-800">
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="w-full flex justify-between items-center py-4 font-bold text-base tracking-wider text-white text-left uppercase focus:outline-none"
            >
              <span>Shop</span>
              <span className="text-white text-xs">
                {shopOpen ? (
                  // Up arrow caret
                  <svg
                    className="w-3.5 h-3.5 transform rotate-180 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  // Down arrow caret
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {shopOpen && (
              <ul
                className="pl-0 pb-4 space-y-4 text-neutral-400 text-sm font-normal"
                style={{ fontFamily: "Archivo, sans-serif" }}
              >
                <li>
                  <Link
                    href="/store/skateboards"
                    className="hover:text-white transition-colors block"
                  >
                    Skateboards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store/surfskates"
                    className="hover:text-white transition-colors block"
                  >
                    Surfskates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store/apparel"
                    className="hover:text-white transition-colors block"
                  >
                    Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store/protection-gears"
                    className="hover:text-white transition-colors block"
                  >
                    Protective Gear
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* ACADEMY */}
          <div className="border-b border-neutral-800">
            <Link
              href="/academy"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              ACADEMY
            </Link>
          </div>

          {/* ABOUT US */}
          <div className="border-b border-neutral-800">
            <Link
              href="/about"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              ABOUT US
            </Link>
          </div>

          {/* BUYING GUIDES */}
          <div className="border-b border-neutral-800">
            <Link
              href="/guides"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              BUYING GUIDES
            </Link>
          </div>

          {/* BLOGS */}
          <div className="border-b border-neutral-800">
            <Link
              href="/blogs"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              BLOGS
            </Link>
          </div>

          {/* STORES */}
          <div className="border-b border-neutral-800">
            <Link
              href="/stores"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              STORES
            </Link>
          </div>
        </div>

        {/* DESKTOP MIDDLE SECTION: Large Logo & Social Icons */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-end gap-30 pb-25">
          {/* Brand Logo */}
          <svg
            className="w-full max-w-[1255px] h-auto"
            viewBox="0 0 1255 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1020.27 0.336923C1035.59 -1.54895 1061.89 4.66805 1073.74 14.3324C1087.97 25.9513 1093.1 36.0909 1095.65 53.6624C1105.48 21.4409 1124.65 5.44636 1158.42 1.12896C1181.62 -1.838 1209.72 1.69167 1228.55 16.2967C1261.35 41.7378 1262.52 106.96 1238.27 138.51C1224.77 156.055 1204.53 161.758 1183.34 164.203C1157.95 165.141 1132.19 162.363 1113.19 143.106C1103.61 133.398 1099.73 123.555 1095.66 110.939C1094.14 122.979 1090.67 133.654 1082.48 142.942C1057.64 171.095 997.583 171.102 970.051 147.279C951.985 130.987 947.4 107.558 947.035 84.5042C946.232 33.6874 968.062 3.47715 1020.27 0.336923ZM1027.09 28.4854C1025.4 28.4089 1021.67 28.376 1020.11 28.7472C982.473 32.2565 981.01 64.9608 982.958 95.5287C983.699 107.138 988.03 120.275 997.276 127.863C1010.96 138.965 1036.39 139 1050.66 129.131C1059.46 121.925 1063.03 113.505 1062.92 102.075H1094.21C1092.46 92.2789 1091.98 72.6965 1094.11 62.892H1061.7C1060.16 41.5797 1049.65 29.5059 1027.09 28.4854ZM1219 69.7241C1215.86 39.3736 1196.92 26.986 1167.86 28.6979C1129.52 33.3896 1125.94 63.6283 1128.77 96.3485C1131.28 125.441 1153.3 139.343 1181.17 135.787L1181.48 135.745C1216.57 131.936 1222.05 99.0615 1219 69.7241Z"
              fill="white"
            />
            <path
              d="M163.875 3.013L300.974 3.01161L296.027 31.2908H220.7V66.6839H289.956C288.239 75.9906 286.571 85.3054 284.951 94.6296H220.7V133.204H278.351C276.467 142.302 274.944 152.439 273.208 161.699H186.102L186.113 78.2839C186.116 65.7812 186.711 45.487 185.801 33.4205C182.846 47.481 180.37 63.5261 177.843 77.7786L162.939 161.699H123.827C120.968 150.789 118.557 138.63 115.927 127.551C109.113 98.8531 102.919 69.8358 95.8956 41.2049C92.6612 53.3886 89.7635 67.8053 86.9513 80.2135L68.4 161.699H28.0659C25.7864 145.091 21.4981 124.228 18.5227 107.425L0 3.01358L30.3542 3.013C32.2082 10.6692 34.0107 23.0959 35.4304 31.0964L45.3468 87.1126C47.1944 97.5506 49.0449 109.593 51.3551 119.755C53.5699 107.113 57.1946 92.0827 59.9183 79.3821L76.3357 3.013H117.386C122.365 27.4489 128.514 52.5834 133.716 77.0813C135.74 86.6143 140.668 111.481 143.356 119.464C145.108 106.856 148.109 91.976 150.349 79.2905L163.875 3.013Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M487.622 2.99611C486.081 9.40828 484.538 19.8417 483.323 26.6547L475.088 72.8745C483.327 66.1691 493.913 55.906 501.922 48.5915L551.867 2.99611H597.065L525.36 67.5166C535.401 89.3028 546.263 111.39 556.585 133.124C564.791 119.425 573.367 103.095 581.243 88.9447L629.073 2.99611H671.513C673.357 13.3008 675.96 24.6673 678.094 35.0079C680.876 46.8968 683.333 60.159 685.843 72.2665L704.498 161.699H669.252C667.049 152.736 664.955 139.835 663.151 130.502H593.774L576.935 161.698C561.668 161.908 546.402 161.908 531.14 161.699L498.815 91.2075C488.538 99.1444 477.842 108.12 467.682 116.329L459.608 161.699H425.083C433.612 109.309 443.925 55.4087 453.137 2.99611H487.622ZM644.755 32.8788C642.072 37.7485 639.435 43.073 637.087 48.1173C628.413 66.7366 617.842 84.4386 608.584 102.728H657.836C654.818 86.7691 651.909 70.79 649.104 54.7919C648.514 51.3236 646.265 34.8151 644.755 32.8788Z"
              fill="white"
            />
            <path
              d="M690.486 2.99704L952.124 2.99362C950.302 12.3954 948.753 21.8342 946.879 31.2664H855.291C852.966 41.6006 850.901 55.9349 849.022 66.6554H930.415C928.813 75.9854 927.16 85.3066 925.454 94.6174H843.91C841.875 107.423 839.469 120.438 837.237 133.231L929.01 133.233C928.276 137.471 927.836 139.65 926.5 143.715C921.805 153.012 912.645 160.632 901.947 161.322C891.433 161.999 880.405 161.671 869.84 161.678L797.567 161.683C805.882 118.852 812.411 74.8848 820.692 31.9527H770.59C768.791 44.1515 766.131 57.1224 764.049 69.4013C758.839 100.147 752.946 130.931 747.909 161.695H713.201C721.494 119.572 728.549 74.5106 736.089 31.9527H685.397C687.016 22.2874 688.716 12.6351 690.486 2.99704Z"
              fill="white"
            />
            <path
              d="M346.319 3.2016C348.259 2.78986 370.504 2.94488 374.009 2.94616L444.525 2.99239L439.548 31.4503L382.158 31.4486C372.699 31.4509 363.143 31.1243 353.673 31.9701C346.932 32.5729 339.819 39.7244 341.129 46.7465C342.596 54.6185 353.591 59.0033 359.898 62.6385C376.907 72.2208 393.402 78.0652 409.955 88.7765C430.983 102.383 429.013 126.224 416.791 145.445C410.736 154.968 400.23 159.613 389.231 161.471C382.175 162.223 363.715 161.736 356.07 161.734L290.202 161.699C291.957 152.204 293.625 142.694 295.206 133.168L351.542 133.137C360.679 133.137 370.065 133.556 379.174 132.954C392.222 132.092 399.255 117.923 387.253 109.424C379.899 104.217 371.222 100.949 363.25 96.7767C339.179 83.9108 302.177 74.4254 309.734 39.1019C314.082 18.7764 324.843 5.66885 346.319 3.2016Z"
              fill="white"
            />
          </svg>

          {/* Social Links */}
          <div className="flex items-center gap-6 text-white self-end md:self-end">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={insta.src} alt="Instagram" className="h-6 w-6" />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={fb.src} alt="Facebook" className="h-6 w-6" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={yt.src} alt="YouTube" className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* MOBILE MIDDLE SECTION: Social Icons */}
        <div className="flex md:hidden items-center gap-6 text-white mb-8">
          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="hover:text-neutral-400 transition-colors"
          >
            <img
              src={yt.src}
              alt="YouTube"
              className="h-5 w-auto"
              style={{ maxHeight: "24px" }}
            />
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-neutral-400 transition-colors"
          >
            <img
              src={fb.src}
              alt="Facebook"
              className="h-5 w-auto"
              style={{ maxHeight: "24px" }}
            />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-neutral-400 transition-colors"
          >
            <img
              src={insta.src}
              alt="Instagram"
              className="h-5 w-auto"
              style={{ maxHeight: "24px" }}
            />
          </a>

          {/* LinkedIn */}
          {/* <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-neutral-400 transition-colors text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-auto"
              style={{ maxHeight: "24px" }}
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a> */}
        </div>

        {/* BOTTOM SECTION: Copyright & Legal Meta (Desktop) */}
        <div
          className="hidden md:flex flex-row justify-between items-center gap-4 text-[clamp(0.75rem,1.5vw,0.875rem)] text-white"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          <p>&copy; {currentYear} Weskateco Pvt Ltd</p>
          <div className="flex items-center gap-2">
            <Link
              href="/refund-policy"
              className="hover:text-white transition-colors"
            >
              Refund policy
            </Link>
            <span className="text-white">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Legal Meta (Mobile) */}
        <div
          className="flex md:hidden flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 mb-10"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          <span>&copy;{currentYear} Weskateco Pvt Ltd</span>
          <span className="text-neutral-600 font-light">|</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <div className="basis-full h-0" />
          <Link
            href="/shipping-policy"
            className="hover:text-white transition-colors"
          >
            Shipping Policy
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Brand Logo - Mobile */}
        <svg
          width="848"
          height="116"
          viewBox="0 0 212 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex md:hidden w-full h-auto text-white mt-4"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M171.231 0.0553302C173.746 -0.254373 178.066 0.766597 180.011 2.3537C182.349 4.26178 183.192 5.92692 183.61 8.81255C185.224 3.52107 188.373 0.894412 193.918 0.1854C197.728 -0.30184 202.342 0.27781 205.436 2.67627C210.822 6.85427 211.013 17.5652 207.031 22.7464C204.814 25.6277 201.49 26.5642 198.01 26.9657C193.84 27.1198 189.61 26.6637 186.491 23.5012C184.917 21.9069 184.28 20.2904 183.611 18.2187C183.361 20.1958 182.793 21.949 181.447 23.4743C177.367 28.0977 167.505 28.0988 162.984 24.1864C160.017 21.511 159.264 17.6634 159.204 13.8775C159.072 5.53222 162.657 0.571025 171.231 0.0553302ZM172.351 4.67794C172.074 4.66536 171.46 4.65996 171.204 4.72092C165.023 5.29723 164.783 10.668 165.103 15.6879C165.225 17.5944 165.936 19.7518 167.455 20.9979C169.702 22.8211 173.878 22.8269 176.221 21.2062C177.666 20.0229 178.253 18.6401 178.235 16.763H183.373C183.086 15.1542 183.006 11.9384 183.357 10.3283H178.034C177.782 6.82831 176.056 4.84552 172.351 4.67794ZM203.867 11.4502C203.35 6.46602 200.241 4.43169 195.468 4.71283C189.173 5.48331 188.584 10.4492 189.048 15.8226C189.461 20.6001 193.077 22.8832 197.654 22.2992L197.705 22.2924C203.467 21.6668 204.367 16.2681 203.867 11.4502Z"
            fill="currentColor"
          />
          <path
            d="M30.5916 0.494801L53.1063 0.494572L52.2939 5.13864H39.9236V10.951H51.2968C51.0149 12.4793 50.741 14.009 50.475 15.5403H39.9236V21.875H49.391C49.0817 23.3692 48.8317 25.0339 48.5465 26.5545H34.2417L34.2436 12.856C34.2441 10.8027 34.3418 7.46997 34.1923 5.48839C33.7071 7.79743 33.3004 10.4324 32.8855 12.773L30.4379 26.5545H24.0148C23.5452 24.7629 23.1494 22.7662 22.7174 20.9466C21.5985 16.2339 20.5812 11.4686 19.4279 6.76676C18.8967 8.76759 18.4208 11.1351 17.959 13.1728L14.9125 26.5545H8.28874C7.91438 23.8272 7.21015 20.401 6.72153 17.6416L3.67969 0.494896L8.66452 0.494801C8.96898 1.75212 9.265 3.79285 9.49814 5.10672L11.1266 14.3058C11.43 16.02 11.7339 17.9977 12.1133 19.6665C12.4771 17.5904 13.0723 15.122 13.5196 13.0363L16.2157 0.494801H22.9571C23.7747 4.50772 24.7846 8.63535 25.6389 12.6585C25.9713 14.224 26.7805 18.3077 27.2219 19.6186C27.5096 17.5481 28.0025 15.1045 28.3703 13.0213L30.5916 0.494801Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M83.7581 0.492028C83.505 1.54505 83.2516 3.25845 83.052 4.37729L81.6996 11.9676C83.0527 10.8664 84.7912 9.18101 86.1064 7.97981L94.3084 0.492028H101.731L89.9555 11.0877C91.6044 14.6655 93.3882 18.2928 95.0833 21.8619C96.4309 19.6123 97.8392 16.9305 99.1327 14.6067L106.987 0.492028H113.957C114.26 2.18429 114.687 4.05091 115.038 5.74908C115.495 7.7015 115.898 9.87943 116.31 11.8678L119.374 26.5545H113.586C113.224 25.0827 112.88 22.964 112.584 21.4314H101.191L98.4252 26.5544C95.9181 26.5888 93.411 26.5888 90.9046 26.5545L85.5962 14.9783C83.9084 16.2817 82.152 17.7558 80.4834 19.1039L79.1575 26.5545H73.4877C74.8884 17.951 76.5819 9.09934 78.0949 0.492028H83.7581ZM109.563 5.39943C109.122 6.19914 108.689 7.07354 108.304 7.90193C106.879 10.9596 105.143 13.8667 103.623 16.8702H111.711C111.215 14.2494 110.738 11.6253 110.277 8.99804C110.18 8.42847 109.811 5.71741 109.563 5.39943Z"
            fill="currentColor"
          />
          <path
            d="M117.073 0.49218L160.04 0.491618C159.74 2.0356 159.486 3.58566 159.178 5.13464H144.137C143.756 6.83174 143.417 9.18575 143.108 10.9463H156.474C156.211 12.4785 155.94 14.0092 155.66 15.5383H142.268C141.934 17.6412 141.539 19.7786 141.173 21.8795L156.244 21.8798C156.123 22.5757 156.051 22.9337 155.832 23.6012C155.06 25.128 153.556 26.3793 151.799 26.4926C150.073 26.6039 148.262 26.55 146.527 26.5511L134.658 26.5519C136.023 19.5182 137.096 12.2977 138.456 5.24735H130.228C129.932 7.25065 129.495 9.38077 129.154 11.3972C128.298 16.4464 127.33 21.5018 126.503 26.5538H120.803C122.165 19.6364 123.324 12.2363 124.562 5.24735H116.237C116.503 3.66009 116.782 2.07497 117.073 0.49218Z"
            fill="currentColor"
          />
          <path
            d="M60.5529 0.525773C60.8715 0.458158 64.5247 0.483614 65.1002 0.483824L76.6805 0.491417L75.8632 5.16484L66.4385 5.16455C64.8852 5.16494 63.3159 5.1113 61.7607 5.2502C60.6537 5.34919 59.4856 6.52362 59.7006 7.67681C59.9416 8.96957 61.7471 9.68965 62.7829 10.2866C65.5762 11.8603 68.285 12.82 71.0033 14.5791C74.4567 16.8135 74.133 20.7288 72.126 23.8852C71.1316 25.4492 69.4063 26.2119 67.6001 26.5171C66.4412 26.6405 63.4097 26.5606 62.1542 26.5602L51.3373 26.5545C51.6255 24.9953 51.8994 23.4335 52.159 21.8692L61.4106 21.8641C62.9111 21.8641 64.4525 21.9328 65.9485 21.834C68.0912 21.6924 69.2463 19.3656 67.2752 17.9698C66.0675 17.1147 64.6425 16.578 63.3333 15.8929C59.3803 13.78 53.3039 12.2223 54.5449 6.4214C55.259 3.08349 57.0261 0.93095 60.5529 0.525773Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </footer>
  );
}
