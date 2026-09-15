import { ADMIN_SESSION_COOKIE } from "lib/constants";
import { ADMIN_SESSION_DURATION_SECONDS } from "lib/admin/session";
import { verifySessionToken, type AdminSession } from "lib/admin/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export {
  BCRYPT_ROUNDS,
  hashPassword,
  MAX_PASSWORD_LENGTH,
  verifyPassword,
} from "lib/admin/password";
export {
  ADMIN_SESSION_DURATION_SECONDS,
  createSessionToken,
  verifySessionToken,
  type AdminSession,
  type SessionTokenOptions,
} from "lib/admin/session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/admin",
} as const;

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
