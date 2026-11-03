import { randomBytes } from "node:crypto";

/**
 * The alphabet references are drawn from: Crockford-ish, with `0`/`O` and `1`/`I`/`L`
 * removed. The customer reads this aloud or types it back to support, and "was that
 * a zero or an O" is a support ticket.
 */
export const ENQUIRY_REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Six characters is 31^6 ≈ 8.9×10⁸ values per prefix per day, against the 9,000
 * that four decimal digits gave. `contact_enquiries.enquiry_id` enforces
 * uniqueness, so this only has to make a collision vanishingly unlikely — and at
 * a hundred enquiries a day the chance is around one in ten million per day.
 */
export const ENQUIRY_REFERENCE_LENGTH = 6;

/**
 * `length` characters from the alphabet, uniformly distributed.
 *
 * Rejection sampling rather than `byte % 31`: 256 is not a multiple of 31, so a
 * plain modulo would make the first few characters of the alphabet measurably
 * more likely than the rest. Bytes that fall in the unrepresentable tail are
 * discarded and redrawn.
 */
export function newEnquiryReference(
  length: number = ENQUIRY_REFERENCE_LENGTH,
): string {
  const alphabetLength = ENQUIRY_REFERENCE_ALPHABET.length;
  const limit = Math.floor(256 / alphabetLength) * alphabetLength;
  let reference = "";

  while (reference.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte >= limit) {
        continue;
      }

      reference += ENQUIRY_REFERENCE_ALPHABET.charAt(byte % alphabetLength);

      if (reference.length === length) {
        break;
      }
    }
  }

  return reference;
}

/**
 * The reference the customer is shown, e.g. `PRD-260924-K7M2QX`. The date makes it
 * locatable and sortable at a glance; the random suffix makes it unique.
 *
 * Dates are UTC, not local, so the same instant produces the same reference on any
 * machine — which is also what lets it be tested.
 */
export function generateEnquiryId(
  prefix: string,
  now: Date = new Date(),
): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");

  return `${prefix}-${yy}${mm}${dd}-${newEnquiryReference()}`;
}
