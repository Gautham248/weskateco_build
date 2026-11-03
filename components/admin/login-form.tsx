"use client";

import clsx from "clsx";
import { loginAction, type ActionState } from "lib/admin/actions";
import { useActionState } from "react";

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputClasses}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClasses}
        />
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          "flex h-12 w-full cursor-pointer items-center justify-center rounded-sm border border-black bg-black text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100",
          { "cursor-not-allowed opacity-60 hover:bg-black": isPending },
        )}
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
