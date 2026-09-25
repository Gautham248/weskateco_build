import { generateEnquiryId } from "lib/contact/enquiry-reference";
import {
  checkContactRateLimit,
  clientIdentifier,
} from "lib/contact/rate-limit";
import { ROUTES, REASON_LABELS } from "lib/contact/routes";
import { getDb, schema } from "lib/db";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/contact/submit
//
// Server-side submission handler. Validates the payload, derives routedTo /
// responseSla / consent from trusted sources, generates an enquiryId, stores
// the enquiry and returns the receipt.
//
// There is deliberately no phone/OTP gate here. The form collects a mobile
// number so the team can call back, but it is not verified: a verification step
// that cannot deliver a code only blocks the one contact path the site has.
// Consent, the honeypot, the seconds-on-page check and a per-caller rate limit are
// the anti-spam measures instead - see docs/contact-enquiry-flow-decisions.md.
// The limiter fails open, so a limiter outage cannot close this route either.
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /\d{10,}/;
const URL_RE = /^https?:\/\/.+\..+/;

const { contactEnquiries } = schema;

interface SubmitPayload {
  reason: string;
  answers: Record<string, string | string[]>;
  consent: boolean;
  honeypot?: string;
  secondsOnPage?: number;
}

function validatePayload(data: SubmitPayload): string[] {
  const errors: string[] = [];

  if (!data.reason || !ROUTES[data.reason]) {
    errors.push("Please choose a reason for contacting us.");
    return errors;
  }

  if (data.honeypot) {
    // Silently drop bot submissions — but we still return a fake success.
    return [];
  }

  if (typeof data.secondsOnPage === "number" && data.secondsOnPage < 3) {
    errors.push("That was quick. Give it a moment and press submit again.");
    return errors;
  }

  const route = ROUTES[data.reason]!;

  // Validate qualifying fields
  for (const field of route.fields) {
    if (!field.required) continue;
    const val = data.answers[field.name];
    if (field.multi) {
      if (!Array.isArray(val) || val.length === 0) {
        errors.push(`${field.label}: Select at least one.`);
      }
    } else {
      if (!val || (typeof val === "string" && val.trim() === "")) {
        errors.push(`${field.label} is required.`);
      }
    }
  }

  // Validate shared fields
  const requiredShared = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "message",
  ];
  for (const name of requiredShared) {
    const val = data.answers[name];
    if (!val || (typeof val === "string" && val.trim() === "")) {
      errors.push(`${name} is required.`);
    }
  }

  // Email format
  const email = data.answers.email;
  if (typeof email === "string" && email.trim() && !EMAIL_RE.test(email)) {
    errors.push("Enter a valid email address.");
  }

  // Phone format
  const phone = data.answers.phone;
  if (typeof phone === "string" && phone.trim()) {
    const digits = phone.replace(/\D/g, "");
    if (!PHONE_DIGITS_RE.test(digits)) {
      errors.push("Enter a valid mobile number.");
    }
  }

  // URL fields
  for (const field of route.fields) {
    if (field.type === "url") {
      const val = data.answers[field.name];
      if (typeof val === "string" && val.trim()) {
        if (!URL_RE.test(val)) {
          errors.push(`${field.label} must be a valid URL.`);
        }
      }
    }
  }

  // Consent
  if (!data.consent) {
    errors.push("Please tick the consent box so we are able to reply to you.");
  }

  return errors;
}

function stripEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const data: SubmitPayload = await request.json();

    const errors = validatePayload(data);

    // Bot trap — return fake success silently
    if (data.honeypot && errors.length === 0) {
      // Logged so a spam wave is visible in the logs rather than silent, but the
      // response tells the bot nothing.
      console.info(
        "[contact/submit] honeypot tripped; answering as if accepted",
      );

      return NextResponse.json({
        success: true,
        enquiryId: generateEnquiryId("SPAM"),
        routedTo: "n/a",
        responseSla: "n/a",
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Checked here rather than first: validating is cheap and the honeypot path
    // writes nothing, whereas every submission that gets this far costs a row and
    // somebody's attention.
    const limit = await checkContactRateLimit(clientIdentifier(request));

    if (!limit.allowed) {
      console.info(
        `[contact/submit] rate limited (${limit.hits} hits against a limit of ${limit.limit})`,
      );

      return NextResponse.json(
        {
          success: false,
          errors: [
            "That is a few too many enquiries from this connection. Please try again shortly.",
          ],
        },
        { status: 429 },
      );
    }

    const route = ROUTES[data.reason]!;
    const enquiryId = generateEnquiryId(route.prefix);
    const reasonLabel = REASON_LABELS[data.reason] ?? data.reason;

    // Build answers — exclude honeypot, consent, and reason
    const {
      company_website: _h,
      consent: _c,
      reason: _r,
      ...rest
    } = data.answers as Record<string, unknown>;
    const answers = stripEmpty(rest as Record<string, unknown>);

    const meta = {
      submittedAt: new Date().toISOString(),
      sourcePage: "/contact",
      referrer: request.headers.get("referer") ?? null,
      utm: {
        source: null,
        medium: null,
        campaign: null,
        term: null,
        content: null,
      },
      language: request.headers.get("accept-language")?.slice(0, 10) ?? null,
      secondsOnForm: data.secondsOnPage ?? 0,
    };

    // Persist before reporting success. The receipt the customer is shown is
    // only truthful if the enquiry actually landed, so a failed write answers
    // 500 rather than inventing a reference nobody can look up.
    await getDb().insert(contactEnquiries).values({
      enquiryId,
      reason: data.reason,
      reasonLabel,
      routedTo: route.team,
      responseSla: route.sla,
      answers,
      consent: data.consent,
      meta,
    });

    console.info("[contact/submit] enquiry stored:", enquiryId);

    return NextResponse.json({
      success: true,
      enquiryId,
      reasonLabel,
      routedTo: route.team,
      responseSla: route.sla,
    });
  } catch (error) {
    console.error("[contact/submit] could not store the enquiry:", error);
    return NextResponse.json(
      { success: false, errors: ["Something went wrong. Please try again."] },
      { status: 500 },
    );
  }
}
