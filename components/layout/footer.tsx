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
                  href="/store/portable-ramps"
                  className="hover:text-white transition-colors"
                >
                  Portable Ramps
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
              href="/about-us"
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
            {/* Hidden: /blogs and /stores 404 — no such page exists.
                Restore by uncommenting. */}
            {/*
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
            */}
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
                    href="/store/portable-ramps"
                    className="hover:text-white transition-colors block"
                  >
                    Portable Ramps
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
              href="/about-us"
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

          {/* Hidden: /blogs and /stores 404 — no such page exists.
              Restore by uncommenting. */}
          {/*
          <div className="border-b border-neutral-800">
            <Link
              href="/blogs"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              BLOGS
            </Link>
          </div>

          <div className="border-b border-neutral-800">
            <Link
              href="/stores"
              className="block py-4 font-bold text-base tracking-wider text-white uppercase"
            >
              STORES
            </Link>
          </div>
          */}
        </div>

        {/* DESKTOP MIDDLE SECTION: Large Logo & Social Icons
            Logo and social icons share one flex row, bottom-aligned, so the
            skateboard wheels sit on the same baseline as the bottom of the
            icons. Both ends are flush with the content box above and below. */}
        <div className="hidden md:flex flex-row justify-between items-end gap-10 pb-20">
          {/* Brand Logo — width is a share of the content container, height
              derived from it, so the intrinsic aspect ratio is preserved. */}
          <img
            src="/icons/weskate-logo.png"
            alt="WeSkate Co"
            className="w-[9%] h-auto"
          />

          {/* Social Links */}
          <div className="flex items-end gap-4.5 text-white">
            {/* Instagram */}
            <a
              href="https://instagram.com/weskateco"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={insta.src} alt="Instagram" className="h-5.5 w-5.5" />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/weskateco"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={fb.src} alt="Facebook" className="h-5.5 w-5.5" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@weskateco2020"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-neutral-400 transition-colors"
            >
              <img src={yt.src} alt="YouTube" className="h-5.5 w-5.5" />
            </a>
          </div>
        </div>

        {/* MOBILE MIDDLE SECTION: Social Icons */}
        <div className="flex md:hidden items-center gap-6 text-white mb-8">
          {/* YouTube */}
          <a
            href="https://youtube.com/@weskateco"
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
            href="https://facebook.com/weskateco"
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
            href="https://instagram.com/weskateco"
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
          className="hidden md:flex flex-row justify-between items-center gap-4 text-[clamp(0.75rem,1.5vw,0.875rem)] text-neutral-400"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          <p>&copy; {currentYear} Weskateco Pvt Ltd</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/refund-policy"
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </Link>
            <span className="text-neutral-600 font-light">|</span>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
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
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <Link
            href="/refund-policy"
            className="hover:text-white transition-colors"
          >
            Refund Policy
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <Link
            href="/terms-of-service"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <Link
            href="/shipping-policy"
            className="hover:text-white transition-colors"
          >
            Shipping Policy
          </Link>
          <span className="text-neutral-600 font-light">|</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Brand Logo - Mobile */}
        <img
          src="/icons/weskate-logo.png"
          alt="WeSkate Co"
          className="flex md:hidden h-24 w-auto mt-4"
        />
      </div>
    </footer>
  );
}
