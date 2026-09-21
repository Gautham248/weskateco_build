import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/otp/send
//
// Stubbed OTP send endpoint. Generates a 6-digit code, stores it server-side
// in memory (with rate limiting per phone number), and logs it to the console.
//
// TODO: replace with a real SMS provider (e.g. Twilio, MSG91, AWS SNS).
//       Configure the provider via environment variables:
//         OTP_PROVIDER=twilio|msg91|sns
//         OTP_API_KEY=...
//         OTP_SENDER_ID=...
// ---------------------------------------------------------------------------

// In-memory store — fine for dev/stub, will need Redis/DB in production.
const otpStore = new Map<
  string,
  { code: string; expiresAt: number; attempts: number }
>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute between sends
const CODE_TTL_MS = 10 * 60_000; // 10 minutes
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const { phone } = (await request.json()) as { phone?: string };

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 },
      );
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      return NextResponse.json(
        { success: false, error: "Enter a valid mobile number." },
        { status: 400 },
      );
    }

    // Rate limit: one send per number per minute
    const existing = otpStore.get(digits);
    if (existing && Date.now() - (existing.expiresAt - CODE_TTL_MS) < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { success: false, error: "Please wait before requesting another OTP." },
        { status: 429 },
      );
    }

    const code = generateCode();
    otpStore.set(digits, {
      code,
      expiresAt: Date.now() + CODE_TTL_MS,
      attempts: 0,
    });

    // TODO: send SMS via provider
    console.log(`[otp/send] OTP for ${digits}: ${code}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not send the OTP. Check the number and try again." },
      { status: 500 },
    );
  }
}
