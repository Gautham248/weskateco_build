"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
        type === "plus"
          ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          : "bg-[#f2f2f2] text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-3.5 w-3.5 stroke-[2.5]" />
      ) : (
        <MinusIcon className="h-3.5 w-3.5 stroke-[2.5]" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
