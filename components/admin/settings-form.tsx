"use client";

import clsx from "clsx";
import {
  changePasswordAction,
  createAdminUserAction,
  type ActionState,
} from "lib/admin/actions";
import { useActionState, useEffect, useRef } from "react";

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const labelClasses =
  "mb-2 block text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400";

const submitClasses =
  "cursor-pointer rounded-sm border border-black bg-black px-6 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100";

function StatusMessage({ state }: { state: ActionState }) {
  if (!state) {
    return null;
  }

  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
      >
        {state.error}
      </p>
    );
  }

  return (
    <p className="rounded-sm border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900">
      {state.success}
    </p>
  );
}

export function SettingsForm({
  users,
}: {
  users: { id: string; username: string; createdAt: string }[];
}) {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(changePasswordAction, null);

  const [userState, userAction, isUserPending] = useActionState<
    ActionState,
    FormData
  >(createAdminUserAction, null);

  const createUserFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (userState?.success) {
      createUserFormRef.current?.reset();
    }
  }, [userState]);

  return (
    <div className="space-y-12">
      <section className="max-w-md space-y-4">
        <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
          Change your password
        </h2>
        <form action={passwordAction} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className={labelClasses}>
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className={labelClasses}>
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              className={inputClasses}
            />
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              8–72 characters.
            </p>
          </div>

          <StatusMessage state={passwordState} />

          <button
            type="submit"
            disabled={isPasswordPending}
            className={submitClasses}
          >
            {isPasswordPending ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>

      <section className="max-w-md space-y-4">
        <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
          Add an admin
        </h2>
        <form ref={createUserFormRef} action={userAction} className="space-y-4">
          <div>
            <label htmlFor="username" className={labelClasses}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              required
              minLength={3}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="newUserPassword" className={labelClasses}>
              Password
            </label>
            <input
              id="newUserPassword"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              className={inputClasses}
            />
          </div>

          <StatusMessage state={userState} />

          <button
            type="submit"
            disabled={isUserPending}
            className={submitClasses}
          >
            {isUserPending ? "Creating…" : "Create account"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-clash text-lg font-bold tracking-widest uppercase">
          Admin accounts
        </h2>
        <ul className="divide-y divide-neutral-200 rounded-sm border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="font-medium">{user.username}</span>
              <span
                className={clsx(
                  "text-xs text-neutral-500 dark:text-neutral-400",
                )}
              >
                Added {new Date(user.createdAt).toLocaleDateString("en-GB")}
              </span>
            </li>
          ))}
          {users.length === 0 ? (
            <li className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
              No admin accounts yet.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
