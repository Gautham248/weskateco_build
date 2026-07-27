"use client";

import clsx from "clsx";
import { useNavbarScroll } from "components/layout/navbar/navbar-scroll";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  const scrolled = useNavbarScroll();

  return (
    <div className="relative flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-md transition-colors">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(
          "h-8 transition-all ease-in-out hover:scale-110",
          className,
        )}
      >
        <path
          d="M21.0776 13.4609C21.0776 14.8077 20.5426 16.0992 19.5903 17.0515C18.638 18.0038 17.3465 18.5388 15.9997 18.5388C14.653 18.5388 13.3614 18.0038 12.4091 17.0515C11.4569 16.0992 10.9219 14.8077 10.9219 13.4609"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.70312 8.42578H27.292"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.08201 7.70593C4.7524 8.14541 4.57422 8.67994 4.57422 9.22929V26.1551C4.57422 26.8284 4.84171 27.4742 5.31785 27.9504C5.794 28.4265 6.43978 28.694 7.11315 28.694H24.8857C25.559 28.694 26.2048 28.4265 26.681 27.9504C27.1571 27.4742 27.4246 26.8284 27.4246 26.1551V9.22929C27.4246 8.67994 27.2464 8.14541 26.9168 7.70593L24.3779 4.32026C24.1414 4.00493 23.8347 3.749 23.4822 3.57273C23.1296 3.39646 22.7409 3.30469 22.3467 3.30469H9.65208C9.25793 3.30469 8.86918 3.39646 8.51664 3.57273C8.16409 3.749 7.85743 4.00493 7.62094 4.32026L5.08201 7.70593Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {quantity ? (
        <div
          className={clsx(
            "absolute -right-1 -top-0.5 md:-right-2 md:-top-1.5 flex h-3.5 min-w-[14px] md:h-5 md:min-w-[20px] items-center justify-center rounded-full px-0.5 md:px-1 text-[8px] md:text-[10px] font-bold leading-none border-2 transition-colors",
            scrolled
              ? "bg-black text-white border-white dark:bg-white dark:text-black dark:border-neutral-900"
              : "bg-white text-black border-transparent",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
