"use client";

import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, type ReactNode } from "react";

/**
 * Centred confirmation dialog, matching the Dialog/Transition pattern used by
 * the cart drawer and mobile menu. Escape and a backdrop click both cancel.
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onCancel} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-all duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-sm border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
              <Dialog.Title className="font-clash text-lg font-bold tracking-widest uppercase">
                {title}
              </Dialog.Title>

              {description ? (
                <Dialog.Description className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {description}
                </Dialog.Description>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="cursor-pointer rounded-sm border border-neutral-300 px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                >
                  {cancelLabel}
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  className={clsx(
                    "cursor-pointer rounded-sm border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors",
                    isDestructive
                      ? "border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                      : "border-black bg-black text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100",
                  )}
                >
                  {confirmLabel}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
