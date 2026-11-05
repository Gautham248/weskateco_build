import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={className}>
    {/* en-IN, not the visitor's browser locale: Indian digit grouping
        (₹1,23,456) in every language, and the server and client render the
        same string. hi-IN would group the same way. */}
    {`${new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    })
      .format(parseFloat(amount))
      .replace(/([^\d\s])(\d)/, "$1 $2")}`}
    {currencyCodeClassName !== "hidden" && (
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    )}
  </p>
);

export default Price;
