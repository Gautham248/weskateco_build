import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { privacyPolicyHtmlHi } from "./privacy-policy/content.hi";
import { refundPolicyHtmlHi } from "./refund-policy/content.hi";
import { shippingPolicyHtmlHi } from "./shipping-policy/content.hi";
import { termsOfServiceHtmlHi } from "./terms-of-service/content.hi";

/**
 * The English policy HTML, read from the page's source: a page file may only
 * export what Next.js expects of a page, so it can't be imported.
 */
function englishHtml(page: string, name: string): string {
  const source = readFileSync(
    new URL(`./${page}/page.tsx`, import.meta.url),
    "utf8",
  );
  const match = source.match(new RegExp(`const ${name} = \`([^\`]*)\`;`));
  if (!match) throw new Error(`${name} not found in ${page}/page.tsx`);
  return match[1]!;
}

const tags = (html: string) =>
  [...html.matchAll(/<\/?[a-z][a-z0-9]*/g)].map(([tag]) => tag);
const attributes = (html: string) =>
  [...html.matchAll(/\b(?:href|class|id|target|rel)="[^"]*"/g)].map(
    ([attribute]) => attribute,
  );
const text = (html: string) => html.replace(/<[^>]+>/g, " ");
const numbers = (html: string) =>
  (text(html).match(/\d+(?:[.,]\d+)*/g) ?? []).sort();
const emails = (html: string) =>
  (html.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []).sort();

const policies = [
  ["privacy-policy", "privacyPolicyHtml", privacyPolicyHtmlHi],
  ["refund-policy", "refundPolicyHtml", refundPolicyHtmlHi],
  ["shipping-policy", "shippingPolicyHtml", shippingPolicyHtmlHi],
  ["terms-of-service", "termsOfServiceHtml", termsOfServiceHtmlHi],
] as const;

// The English text is the binding version, so the Hindi translation must
// carry the same structure and the same facts: an edit to one language that
// isn't made in the other fails here.
describe.each(policies)("%s in Hindi", (page, name, hindi) => {
  const english = englishHtml(page, name);

  it("is actually Hindi", () => {
    expect(hindi).toMatch(/[ऀ-ॿ]/);
    expect(english).not.toMatch(/[ऀ-ॿ]/);
  });

  it("has the same HTML structure", () => {
    expect(tags(hindi)).toEqual(tags(english));
  });

  it("has the same links and attributes", () => {
    expect(attributes(hindi)).toEqual(attributes(english));
  });

  it("has the same numbers (periods, dates, addresses)", () => {
    expect(numbers(hindi)).toEqual(numbers(english));
  });

  it("has the same email addresses", () => {
    expect(emails(hindi)).toEqual(emails(english));
  });
});
