"use client";

import ContactDetails from "components/contact/contact-details";
import Footer from "components/layout/footer";
import EnquiryForm from "components/contact/enquiry-form";
import { getDeflection } from "lib/contact/routes";
import Link from "next/link";
import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// ContactPage — client wrapper composing all four sections.
// ---------------------------------------------------------------------------

export default function ContactPage({ locale }: { locale: string }) {
  const [selectedReason, setSelectedReason] = useState("");
  const handleReasonChange = useCallback((reason: string) => {
    setSelectedReason(reason);
  }, []);

  const deflection = getDeflection(selectedReason || null);

  return (
    <div className="w-full bg-white">
      {/* ── Section 1: Page header ──────────────────────────────────── */}
      <section className="w-full bg-white pt-12 pb-8 md:pt-20 md:pb-12 px-4 lg:px-15">
        <div className="mx-auto max-w-(--breakpoint-2xl)">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-neutral-500">
              <li>
                <Link
                  href={locale === "en" ? "/" : `/${locale}`}
                  className="hover:text-black transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </li>
              <li aria-current="page" className="text-black font-medium">
                Contact Us
              </li>
            </ol>
          </nav>

          <h1
            className="fluid-text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Contact Us
          </h1>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-3xl">
            Whether you are planning a skatepark, opening a trade account,
            booking coaching or following up an order, this is where it starts.
            Every enquiry is routed to the team that owns it.
          </p>
        </div>
      </section>

      {/* ── Section 2: Contact details ──────────────────────────────── */}
      <ContactDetails />

      {/* ── Section 3: Enquiry form ─────────────────────────────────── */}
      <EnquiryForm
        selectedReason={selectedReason}
        onReasonChange={handleReasonChange}
      />

      {/* ── Section 4: Footer ───────────────────────────────────────── */}
      <Footer />

      {/* ── Sticky mobile bottom bar ────────────────────────────────── */}
      {/* TODO: implement only if the project establishes a pattern for it.
          Currently no other page has a sticky bottom bar. */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white px-4 py-3 flex gap-3">
        <a
          href="tel:+917204593003"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-black px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-50 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          Call us
        </a>
        <a
          href="#enquiry"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Enquire now
        </a>
      </div>
    </div>
  );
}
