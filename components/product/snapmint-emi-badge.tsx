"use client";

import snapmintLogo from "components/icons/snapmint_logo.svg";

interface SnapmintEmiBadgeProps {
  /** Product price string from Shopify (e.g. "10283.79") */
  priceAmount: string;
}

/**
 * Compact Snapmint EMI badge for product cards.
 * Renders as an inline line below the price: "or ₹XXXX/Month [icon] Buy on EMI>"
 * Clicking "Buy on EMI>" triggers the GoKwik checkout modal.
 * Propagation is stopped so the parent card <Link> does not navigate.
 */
export function SnapmintEmiBadge({ priceAmount }: SnapmintEmiBadgeProps) {
  const price = parseFloat(priceAmount);
  const monthlyEmi = Math.ceil(price / 3);

  const handleBuyOnEmi = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      typeof window !== "undefined" &&
      typeof window.triggerGokwikCustomCheckout === "function"
    ) {
      window.triggerGokwikCustomCheckout();
    }
  };

  return (
    <div
      className="flex items-center gap-1.5 mt-1 flex-wrap"
      style={{ fontFamily: "Archivo, sans-serif" }}
    >
      <span className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100">
        or ₹{monthlyEmi.toLocaleString("en-IN")}/Month
      </span>
      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#013542] shrink-0">
        <img
          src={snapmintLogo.src || snapmintLogo}
          className="w-2.5 h-2.5 object-contain"
          alt="Snapmint"
        />
      </div>
      <button
        onClick={handleBuyOnEmi}
        className="text-[12px] font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors cursor-pointer flex items-center"
      >
        Buy on EMI&gt;
      </button>
    </div>
  );
}

