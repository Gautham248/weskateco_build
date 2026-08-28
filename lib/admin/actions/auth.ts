"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  validateCredentials,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionToken,
  verifySessionToken,
} from "lib/admin/auth";

export async function loginAction(formData: FormData) {
  const username = (formData.get("username") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  const valid = await validateCredentials(username, password);

  if (!valid) {
    // Return error — handled by client via redirect with ?error param
    redirect("/admin/login?error=invalid");
  }

  const token = await createSessionToken(username);
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function requireAuth() {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) redirect("/admin/login");
}
