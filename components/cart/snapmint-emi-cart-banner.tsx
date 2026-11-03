"use client";

import snapmintLogo from "components/icons/snapmint_logo.svg";

interface SnapmintEmiCartBannerProps {
  /** Cart or product total price string (e.g. "15728.79") */
  totalAmount: string;
  /** Called when the user clicks "Buy on EMI>" */
  onBuyOnEmi: () => void;
}

/**
 * Full Snapmint EMI banner for cart surfaces and the product description page.
 * Matches the visual style of the reference screenshots:
 * - Left column: Two text rows (EMI summary and UPI/snapmint info with circular logo)
 * - Right column: Vertically centered "BUY ON EMI>" button
 */
export function SnapmintEmiCartBanner({
  totalAmount,
  onBuyOnEmi,
}: SnapmintEmiCartBannerProps) {
  const price = parseFloat(totalAmount);
  const monthlyEmi = Math.ceil(price / 3);

  return (
    <div
      className="bg-[#f9f9f9] dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4 mb-4 rounded-sm"
      style={{ fontFamily: "Archivo, sans-serif" }}
    >
      {/* Left side text column */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] text-neutral-600 dark:text-neutral-400 font-normal leading-normal">
          or{" "}
          <strong className="text-neutral-900 dark:text-white font-semibold">
            3
          </strong>{" "}
          Monthly Payments of{" "}
          <strong className="text-neutral-900 dark:text-white font-bold">
            ₹{monthlyEmi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </strong>
        </p>
        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal leading-normal flex items-center gap-1 flex-wrap">
          <span>0% EMI on UPI ·</span>
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#013542] shrink-0">
            <img
              src={snapmintLogo.src || snapmintLogo}
              className="w-2 h-2 object-contain"
              alt="Snapmint Logo"
            />
          </div>
          <span className="italic font-medium">snapmint</span>
        </div>
      </div>


      {/* Right side CTA button */}
      <button
        onClick={onBuyOnEmi}
        className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors cursor-pointer"
      >
        Buy on EMI&gt;
      </button>
    </div>
  );
}

