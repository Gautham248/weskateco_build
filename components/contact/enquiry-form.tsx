"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
} from "react";
import {
  ROUTES,
  SHARED_FIELDS,
  REASON_LABELS,
  type RouteField,
} from "lib/contact/routes";
import ReasonPicker from "components/contact/reason-picker";

// ---------------------------------------------------------------------------
// enquiry-form.tsx — progressive contact-enquiry form
// ---------------------------------------------------------------------------

type OtpState = "idle" | "sending" | "sent" | "verifying" | "verified" | "error";

interface Receipt {
  enquiryId: string;
  reasonLabel: string;
  routedTo: string;
  responseSla: string;
}

export default function EnquiryForm({
  selectedReason,
  onReasonChange,
}: {
  selectedReason: string;
  onReasonChange: (reason: string) => void;
}) {
  // ── Form state ────────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    {},
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── OTP state ─────────────────────────────────────────────────────────
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpPhone, setOtpPhone] = useState(""); // phone number OTP was sent to

  // ── Anti-spam ─────────────────────────────────────────────────────────
  const formOpenedAt = useRef<number>(Date.now());

  // ── Refs for focus management ─────────────────────────────────────────
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<string | null>(null);

  const route = selectedReason ? ROUTES[selectedReason] : null;

  // ── Derived ───────────────────────────────────────────────────────────
  const showSections = !!route;

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleReasonChange = useCallback(
    (val: string) => {
      onReasonChange(val);
      setAnswers({});
      setFieldErrors({});
      setFormError(null);
      setOtpState("idle");
      setOtpCode("");
      setOtpError(null);
      setOtpPhone("");
    },
    [onReasonChange],
  );

  const handleFieldChange = useCallback(
    (name: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
      setFieldErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const handleMultiToggle = useCallback(
    (fieldName: string, option: string) => {
      setAnswers((prev) => {
        const current = Array.isArray(prev[fieldName])
          ? (prev[fieldName] as string[])
          : [];
        const next = current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option];
        return { ...prev, [fieldName]: next };
      });
      setFieldErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    },
    [],
  );

  // ── OTP handlers ──────────────────────────────────────────────────────

  const phoneValue =
    typeof answers.phone === "string" ? answers.phone : "";
  const phoneDigits = phoneValue.replace(/\D/g, "");
  const canSendOtp = phoneDigits.length >= 10 && otpState === "idle";
  const canResendOtp =
    phoneDigits.length >= 10 &&
    (otpState === "sent" || otpState === "error");

  const handleSendOtp = useCallback(async () => {
    if (!canSendOtp && !canResendOtp) return;
    setOtpState("sending");
    setOtpError(null);
    setOtpCode("");

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpState("sent");
        setOtpPhone(phoneValue);
      } else {
        setOtpState("error");
        setOtpError(data.error || "Could not send the OTP.");
      }
    } catch {
      setOtpState("error");
      setOtpError("Could not send the OTP. Check the number and try again.");
    }
  }, [canSendOtp, canResendOtp, phoneValue]);

  const handleVerifyOtp = useCallback(async () => {
    if (otpCode.length !== 6) return;
    setOtpState("verifying");
    setOtpError(null);

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone || phoneValue, code: otpCode }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpState("verified");
        // Clear phone error if it existed
        setFieldErrors((prev) => {
          if (!prev.phone) return prev;
          const next = { ...prev };
          delete next.phone;
          return next;
        });
      } else {
        setOtpState("sent");
        setOtpError(data.error || "That code is not correct. Try again or resend.");
      }
    } catch {
      setOtpState("sent");
      setOtpError("Verification failed. Please try again.");
    }
  }, [otpCode, otpPhone, phoneValue]);

  // Reset OTP when phone changes
  useEffect(() => {
    if (phoneValue !== otpPhone && otpState !== "idle") {
      setOtpState("idle");
      setOtpCode("");
      setOtpError(null);
      setOtpPhone("");
    }
  }, [phoneValue, otpPhone, otpState]);

  // ── Validation ────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!route) {
      setFormError("Please choose a reason for contacting us.");
      return false;
    }

    // Qualifying fields
    for (const field of route.fields) {
      if (!field.required) continue;
      const val = answers[field.name];
      if (field.multi) {
        if (!Array.isArray(val) || val.length === 0) {
          errors[field.name] = "Select at least one.";
        }
      } else {
        if (!val || (typeof val === "string" && val.trim() === "")) {
          errors[field.name] = `${field.label} is required.`;
        }
      }
    }

    // Shared fields
    const sharedRequired = SHARED_FIELDS.filter((f) => f.required);
    for (const field of sharedRequired) {
      const val = answers[field.name];
      if (!val || (typeof val === "string" && val.trim() === "")) {
        errors[field.name] = `${field.label} is required.`;
      }
    }

    // Email format
    const email = answers.email;
    if (typeof email === "string" && email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
      }
    }

    // Phone format
    const phone = answers.phone;
    if (typeof phone === "string" && phone.trim()) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        errors.phone = "Enter a valid mobile number.";
      }
    }

    // URL fields
    for (const field of route.fields) {
      if (field.type === "url") {
        const val = answers[field.name];
        if (typeof val === "string" && val.trim()) {
          if (!/^https?:\/\/.+\..+/.test(val)) {
            errors[field.name] = `${field.label} must be a valid URL.`;
          }
        }
      }
    }

    // OTP verification
    if (otpState !== "verified") {
      errors.phone = "Please verify your mobile number by OTP before submitting.";
    }

    // Consent
    if (!answers.consent) {
      errors.consent =
        "Please tick the consent box so we are able to reply to you.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(
        "Some required fields are incomplete. They are marked below.",
      );
      // Focus first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        firstErrorRef.current = firstKey;
        const el = formRef.current?.querySelector(
          `[name="${firstKey}"]`,
        ) as HTMLElement | null;
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    setFieldErrors({});
    setFormError(null);
    return true;
  }, [route, answers, otpState]);

  // ── Submit ────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setSubmitting(true);
      setFormError(null);

      const honeypot =
        typeof answers.company_website === "string"
          ? answers.company_website
          : "";

      try {
        const res = await fetch("/api/contact/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: selectedReason,
            answers,
            phoneVerified: otpState === "verified",
            consent: !!answers.consent,
            honeypot,
            secondsOnPage: Math.floor(
              (Date.now() - formOpenedAt.current) / 1000,
            ),
          }),
        });
        const data = await res.json();

        if (data.success) {
          setSubmitted(true);
          setReceipt({
            enquiryId: data.enquiryId,
            reasonLabel: data.reasonLabel,
            routedTo: data.routedTo,
            responseSla: data.responseSla,
          });
          // Scroll to top of form
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (data.errors?.length) {
          setFormError(
            data.errors[0] ===
              "That was quick. Give it a moment and press submit again."
              ? data.errors[0]
              : "Some required fields are incomplete. They are marked below.",
          );
          // If server returns field-level errors, map them
          if (data.errors.length > 1) {
            setFormError("Some required fields are incomplete. They are marked below.");
          }
        }
      } catch {
        setFormError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [validate, selectedReason, answers, otpState],
  );

  // ── Reset ─────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    onReasonChange("");
    setAnswers({});
    setFieldErrors({});
    setFormError(null);
    setSubmitted(false);
    setReceipt(null);
    setSubmitting(false);
    setOtpState("idle");
    setOtpCode("");
    setOtpError(null);
    setOtpPhone("");
    formOpenedAt.current = Date.now();
  }, [onReasonChange]);

  // ── Render helpers ────────────────────────────────────────────────────

  const renderField = (field: RouteField) => {
    const errorId = `${field.name}-error`;
    const hintId = field.hint ? `${field.name}-hint` : undefined;
    const describedBy = [
      fieldErrors[field.name] ? errorId : undefined,
      hintId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    const baseInputClasses =
      "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors";

    if (field.type === "select" && field.multi) {
      const selected = Array.isArray(answers[field.name])
        ? (answers[field.name] as string[])
        : [];
      return (
        <div key={field.name} className={field.wide ? "col-span-full" : ""}>
          <fieldset>
            <legend className="block text-sm font-medium text-black mb-2">
              {field.label}
              {field.required && (
                <span className="text-red-600 ml-0.5" aria-hidden="true">
                  *
                </span>
              )}
            </legend>
            {field.hint && (
              <p id={hintId} className="text-xs text-neutral-500 mb-2">
                {field.hint}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {field.options?.map((opt) => (
                <label
                  key={opt}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                    selected.includes(opt)
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-black hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected.includes(opt)}
                    onChange={() => handleMultiToggle(field.name, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {fieldErrors[field.name] && (
              <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
                {fieldErrors[field.name]}
              </p>
            )}
          </fieldset>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name} className={field.wide ? "col-span-full" : ""}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-black mb-1"
          >
            {field.label}
            {field.required && (
              <span className="text-red-600 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {field.hint && (
            <p id={hintId} className="text-xs text-neutral-500 mb-1">
              {field.hint}
            </p>
          )}
          <select
            id={field.name}
            name={field.name}
            value={(answers[field.name] as string) ?? ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClasses}
            aria-describedby={describedBy}
            aria-invalid={!!fieldErrors[field.name]}
          >
            <option value="">Select</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors[field.name] && (
            <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="col-span-full">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-black mb-1"
          >
            {field.label}
            {field.required && (
              <span className="text-red-600 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {field.hint && (
            <p id={hintId} className="text-xs text-neutral-500 mb-1">
              {field.hint}
            </p>
          )}
          <textarea
            id={field.name}
            name={field.name}
            rows={4}
            value={(answers[field.name] as string) ?? ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClasses + " resize-y"}
            aria-describedby={describedBy}
            aria-invalid={!!fieldErrors[field.name]}
          />
          {fieldErrors[field.name] && (
            <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      );
    }

    // text, url, date
    const inputType =
      field.type === "url"
        ? "url"
        : field.type === "date"
          ? "date"
          : "text";

    return (
      <div key={field.name} className={field.wide ? "col-span-full" : ""}>
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-black mb-1"
        >
          {field.label}
          {field.required && (
            <span className="text-red-600 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {field.hint && (
          <p id={hintId} className="text-xs text-neutral-500 mb-1">
            {field.hint}
          </p>
        )}
        <input
          id={field.name}
          name={field.name}
          type={inputType}
          value={(answers[field.name] as string) ?? ""}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClasses}
          aria-describedby={describedBy}
          aria-invalid={!!fieldErrors[field.name]}
          autoComplete={
            field.name === "firstName"
              ? "given-name"
              : field.name === "lastName"
                ? "family-name"
                : field.name === "email"
                  ? "email"
                  : field.name === "phone"
                    ? "tel"
                    : undefined
          }
          inputMode={field.type === "url" ? "url" : undefined}
        />
        {fieldErrors[field.name] && (
          <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
            {fieldErrors[field.name]}
          </p>
        )}
      </div>
    );
  };

  const renderSharedField = (field: RouteField) => {
    // Special handling for the phone field (OTP)
    if (field.name === "phone") {
      return renderPhoneField();
    }
    return renderField(field);
  };

  const renderPhoneField = () => {
    const errorId = "phone-error";
    const hintId = "phone-hint";
    const describedBy = [
      fieldErrors.phone ? errorId : undefined,
      hintId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    const baseInputClasses =
      "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors";

    return (
      <div key="phone" className="col-span-full">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-black mb-1"
        >
          Mobile number
          <span className="text-red-600 ml-0.5" aria-hidden="true">
            *
          </span>
        </label>
        <p id={hintId} className="text-xs text-neutral-500 mb-1">
          We verify this by OTP before the enquiry is submitted.
        </p>
        <div className="flex gap-2">
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phoneValue}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="+91 99999 99999"
            className={baseInputClasses + " flex-1"}
            aria-describedby={describedBy}
            aria-invalid={!!fieldErrors.phone}
            autoComplete="tel"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp && !canResendOtp}
            className="shrink-0 rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            {otpState === "sending"
              ? "Sending…"
              : otpState === "verified"
                ? "Verified"
                : canResendOtp
                  ? "Resend"
                  : "Send OTP"}
          </button>
        </div>

        {/* OTP sent confirmation */}
        {otpState === "sent" && (
          <p className="text-sm text-green-700 mt-2">
            OTP sent successfully to {otpPhone || phoneValue}.
          </p>
        )}

        {/* OTP code input */}
        {(otpState === "sent" || otpState === "verifying") && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              className={baseInputClasses + " w-40"}
              aria-label="OTP verification code"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpCode.length !== 6 || otpState === "verifying"}
              className="shrink-0 rounded-md border border-black px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-50 disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
            >
              {otpState === "verifying" ? "Verifying…" : "Verify"}
            </button>
          </div>
        )}

        {/* OTP verified */}
        {otpState === "verified" && (
          <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Mobile number verified
          </p>
        )}

        {/* OTP error */}
        {otpError && (
          <p className="text-xs text-red-600 mt-2" role="alert">
            {otpError}
          </p>
        )}

        {/* Phone field error */}
        {fieldErrors.phone && (
          <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
            {fieldErrors.phone}
          </p>
        )}
      </div>
    );
  };

  // ── Success state ─────────────────────────────────────────────────────

  if (submitted && receipt) {
    return (
      <section className="w-full bg-white py-12 md:py-20 px-4 lg:px-15">
        <div className="mx-auto max-w-(--breakpoint-2xl)">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="fluid-text-3xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Enquiry received
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-8">
              Your enquiry is with <strong>{receipt.routedTo}</strong>. Expect a
              first response within <strong>{receipt.responseSla}</strong>. Please
              quote the reference below if you follow up.
            </p>

            <dl className="inline-grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-left bg-neutral-50 rounded-lg p-6 mb-8">
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Reference
              </dt>
              <dd className="text-sm font-mono font-medium">{receipt.enquiryId}</dd>

              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Reason
              </dt>
              <dd className="text-sm">{receipt.reasonLabel}</dd>

              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Handled by
              </dt>
              <dd className="text-sm">{receipt.routedTo}</dd>

              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Response by
              </dt>
              <dd className="text-sm">{receipt.responseSla}</dd>
            </dl>

            <div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors"
              >
                Submit another enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────

  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 lg:px-15" id="enquiry">
      <div className="mx-auto max-w-(--breakpoint-2xl)">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h2
            className="fluid-text-2xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Make an enquiry
          </h2>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
            This is the only enquiry form you need — skateparks, products,
            coaching, trade and order support all come through here. Choose a
            reason first and the form will ask only what that team needs in
            order to give you a real answer in the first reply.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="max-w-3xl"
        >
          {/* ── Honeypot (visually hidden, not display:none) ──────────── */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              opacity: 0,
              height: 0,
              width: 0,
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value=""
              onChange={() => {}}
            />
          </div>

          {/* ── Form-level error (aria-live) ─────────────────────────── */}
          {formError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {formError}
            </div>
          )}

          {/* ── Reason selector ──────────────────────────────────────── */}
          <div className="mb-8 relative">
            <label
              id="reason-label"
              className="block text-sm font-medium text-black mb-1"
            >
              Reason for contacting us
              <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
            </label>
            <ReasonPicker
              value={selectedReason}
              onChange={handleReasonChange}
              error={fieldErrors.reason}
              describedBy={fieldErrors.reason ? "reason-error" : undefined}
            />
            {fieldErrors.reason && (
              <p id="reason-error" className="text-xs text-red-600 mt-1" role="alert">
                {fieldErrors.reason}
              </p>
            )}
          </div>

          {/* ── Progressive sections ─────────────────────────────────── */}
          {showSections && route && (
            <>
              {/* Handled-by + SLA strip */}
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-md bg-neutral-50 px-4 py-3 text-sm">
                <span className="text-neutral-500">Handled by</span>{" "}
                <strong className="text-black">{route.team}</strong>
                <span className="text-neutral-300">·</span>
                <span className="text-neutral-500">First response</span>{" "}
                <strong className="text-black">{route.sla}</strong>
              </div>

              {/* Qualifying questions */}
              {route.fields.length > 0 && (
                <fieldset className="mb-8">
                  <legend
                    className="fluid-text-base font-bold tracking-tight mb-1"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {route.legend}
                  </legend>
                  <p className="text-xs text-neutral-500 mb-4">{route.note}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {route.fields.map((field) => renderField(field))}
                  </div>
                </fieldset>
              )}

              {/* Shared "Your details" */}
              <fieldset className="mb-8">
                <legend
                  className="fluid-text-base font-bold tracking-tight mb-1"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  YOUR DETAILS
                </legend>
                <p className="text-xs text-neutral-500 mb-4">
                  We use these to respond to your enquiry.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SHARED_FIELDS.map((field) => renderSharedField(field))}
                </div>
              </fieldset>

              {/* Consent */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!answers.consent}
                    onChange={(e) =>
                      handleFieldChange("consent", e.target.checked ? "yes" : "")
                    }
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                    aria-describedby={
                      fieldErrors.consent ? "consent-error" : undefined
                    }
                    aria-invalid={!!fieldErrors.consent}
                  />
                  <span className="text-xs text-neutral-600 leading-relaxed">
                    I consent to Toucan Distribution Pvt Ltd contacting me by
                    email, telephone or WhatsApp regarding this enquiry, and to
                    my details being stored for that purpose in line with the
                    privacy policy.
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p
                    id="consent-error"
                    className="text-xs text-red-600 mt-1 ml-7"
                    role="alert"
                  >
                    {fieldErrors.consent}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Submitting…" : "Submit enquiry"}
                </button>
                <span className="text-xs text-neutral-500">
                  First response within {route.sla}.
                </span>
              </div>
            </>
          )}
        </form>

      </div>
    </section>
  );
}
