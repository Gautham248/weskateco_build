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
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 md:pt-25 md:px-12 xl:px-0">
        {/* DESKTOP TOP SECTION: Link Columns */}
        <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-24 mb-16">
          {/* Column 1: Shop Categories */}
          <div>
            <h3
              className="font-bold text-[clamp(0.75rem,2vw,1rem)] tracking-widest text-white mb-4 uppercase"
              style={{ fontFamily: "ClashDisplay, sans-serif" }}
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
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
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
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
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
          style={{ fontFamily: "ClashDisplay, sans-serif" }}
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
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-end gap-30 pb-12">
          {/* Brand Logo */}
          <svg
            width="848"
            height="116"
            viewBox="0 0 212 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden md:flex w-48 sm:w-56 md:w-full lg:w-96 h-auto text-white"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M171.231 0.0553302C173.746 -0.254373 178.066 0.766597 180.011 2.3537C182.349 4.26178 183.192 5.92692 183.61 8.81255C185.224 3.52107 188.373 0.894412 193.918 0.1854C197.728 -0.30184 202.342 0.27781 205.436 2.67627C210.822 6.85427 211.013 17.5652 207.031 22.7464C204.814 25.6277 201.49 26.5642 198.01 26.9657C193.84 27.1198 189.61 26.6637 186.491 23.5012C184.917 21.9069 184.28 20.2904 183.611 18.2187C183.361 20.1958 182.793 21.949 181.447 23.4743C177.367 28.0977 167.505 28.0988 162.984 24.1864C160.017 21.511 159.264 17.6634 159.204 13.8775C159.072 5.53222 162.657 0.571025 171.231 0.0553302ZM172.351 4.67794C172.074 4.66536 171.46 4.65996 171.204 4.72092C165.023 5.29723 164.783 10.668 165.103 15.6879C165.225 17.5944 165.936 19.7518 167.455 20.9979C169.702 22.8211 173.878 22.8269 176.221 21.2062C177.666 20.0229 178.253 18.6401 178.235 16.763H183.373C183.086 15.1542 183.006 11.9384 183.357 10.3283H178.034C177.782 6.82831 176.056 4.84552 172.351 4.67794ZM203.867 11.4502C203.35 6.46602 200.241 4.43169 195.468 4.71283C189.173 5.48331 188.584 10.4492 189.048 15.8226C189.461 20.6001 193.077 22.8832 197.654 22.2992L197.705 22.2924C203.467 21.6668 204.367 16.2681 203.867 11.4502Z"
              fill="currentColor"
            />
            <path
              d="M30.5916 0.494801L53.1063 0.494572L52.2939 5.13864H39.9236V10.951H51.2968C51.0149 12.4793 50.741 14.009 50.475 15.5403H39.9236V21.875H49.391C49.0817 23.3692 48.8317 25.0339 48.5465 26.5545H34.2417L34.2436 12.856C34.2441 10.8027 34.3418 7.46997 34.1923 5.48839C33.7071 7.79743 33.3004 10.4324 32.8855 12.773L30.4379 26.5545H24.0148C23.5452 24.7629 23.1494 22.7662 22.7174 20.9466C21.5985 16.2339 20.5812 11.4686 19.4279 6.76676C18.8967 8.76759 18.4208 11.1351 17.959 13.1728L14.9125 26.5545H8.28874C7.91438 23.8272 7.21015 20.401 6.72153 17.6416L3.67969 0.494896L8.66452 0.494801C8.96898 1.75212 9.265 3.79285 9.49814 5.10672L11.1266 14.3058C11.43 16.02 11.7339 17.9977 12.1133 19.6665C12.4771 17.5904 13.0723 15.122 13.5196 13.0363L16.2157 0.494801H22.9571C23.7747 4.50772 24.7846 8.63535 25.6389 12.6585C25.9713 14.224 26.7805 18.3077 27.2219 19.6186C27.5096 17.5481 28.0025 15.1045 28.3703 13.0213L30.5916 0.494801Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M171.231 0.0553302C173.746 -0.254373 178.066 0.766597 180.011 2.3537C182.349 4.26178 183.192 5.92692 183.61 8.81255C185.224 3.52107 188.373 0.894412 193.918 0.1854C197.728 -0.30184 202.342 0.27781 205.436 2.67627C210.822 6.85427 211.013 17.5652 207.031 22.7464C204.814 25.6277 201.49 26.5642 198.01 26.9657C193.84 27.1198 189.61 26.6637 186.491 23.5012C184.917 21.9069 184.28 20.2904 183.611 18.2187C183.361 20.1958 182.793 21.949 181.447 23.4743C177.367 28.0977 167.505 28.0988 162.984 24.1864C160.017 21.511 159.264 17.6634 159.204 13.8775C159.072 5.53222 162.657 0.571025 171.231 0.0553302ZM172.351 4.67794C172.074 4.66536 171.46 4.65996 171.204 4.72092C165.023 5.29723 164.783 10.668 165.103 15.6879C165.225 17.5944 165.936 19.7518 167.455 20.9979C169.702 22.8211 173.878 22.8269 176.221 21.2062C177.666 20.0229 178.253 18.6401 178.235 16.763H183.373C183.086 15.1542 183.006 11.9384 183.357 10.3283H178.034C177.782 6.82831 176.056 4.84552 172.351 4.67794ZM203.867 11.4502C203.35 6.46602 200.241 4.43169 195.468 4.71283C189.173 5.48331 188.584 10.4492 189.048 15.8226C189.461 20.6001 193.077 22.8832 197.654 22.2992L197.705 22.2924C203.467 21.6668 204.367 16.2681 203.867 11.4502Z"
            fill="currentColor"
          />
          <path
            d="M30.5916 0.494801L53.1063 0.494572L52.2939 5.13864H39.9236V10.951H51.2968C51.0149 12.4793 50.741 14.009 50.475 15.5403H39.9236V21.875H49.391C49.0817 23.3692 48.8317 25.0339 48.5465 26.5545H34.2417L34.2436 12.856C34.2441 10.8027 34.3418 7.46997 34.1923 5.48839C33.7071 7.79743 33.3004 10.4324 32.8855 12.773L30.4379 26.5545H24.0148C23.5452 24.7629 23.1494 22.7662 22.7174 20.9466C21.5985 16.2339 20.5812 11.4686 19.4279 6.76676C18.8967 8.76759 18.4208 11.1351 17.959 13.1728L14.9125 26.5545H8.28874C7.91438 23.8272 7.21015 20.401 6.72153 17.6416L3.67969 0.494896L8.66452 0.494801C8.96898 1.75212 9.265 3.79285 9.49814 5.10672L11.1266 14.3058C11.43 16.02 11.7339 17.9977 12.1133 19.6665C12.4771 17.5904 13.0723 15.122 13.5196 13.0363L16.2157 0.494801H22.9571C23.7747 4.50772 24.7846 8.63535 25.6389 12.6585C25.9713 14.224 26.7805 18.3077 27.2219 19.6186C27.5096 17.5481 28.0025 15.1045 28.3703 13.0213L30.5916 0.494801Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
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
