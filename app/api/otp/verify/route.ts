import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/otp/verify
//
// Stubbed OTP verify endpoint. Compares the submitted code against the
// server-side stored code for the given phone number.
//
// TODO: align with whatever storage backend the real OTP send uses.
// ---------------------------------------------------------------------------

// Must share the same in-memory store as the send route.
// In production this would be Redis / DB — for the stub, a global singleton.
const otpStore = new Map<
  string,
  { code: string; expiresAt: number; attempts: number }
>();

// Re-use the same global across hot reloads in dev
const globalForOtp = globalThis as unknown as { __otpStore?: typeof otpStore };
if (!globalForOtp.__otpStore) {
  globalForOtp.__otpStore = otpStore;
}
const store = globalForOtp.__otpStore;

export async function POST(request: Request) {
  try {
    const { phone, code } = (await request.json()) as {
      phone?: string;
      code?: string;
    };

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Phone number and code are required." },
        { status: 400 },
      );
    }

    const digits = phone.replace(/\D/g, "");
    const entry = store.get(digits);

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          error: "No OTP was sent to this number. Please request one first.",
        },
        { status: 400 },
      );
    }

    if (Date.now() > entry.expiresAt) {
      store.delete(digits);
      return NextResponse.json(
        {
          success: false,
          error: "That code has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    if (entry.attempts >= 5) {
      store.delete(digits);
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed attempts. Please request a new OTP.",
        },
        { status: 429 },
      );
    }

    entry.attempts += 1;

    if (entry.code !== code) {
      return NextResponse.json(
        {
          success: false,
          error: "That code is not correct. Try again or resend.",
        },
        { status: 400 },
      );
    }

    // Success — clear the code so it cannot be reused
    store.delete(digits);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
