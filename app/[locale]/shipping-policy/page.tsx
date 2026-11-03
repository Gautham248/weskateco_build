import Prose from "components/prose";
import Footer from "components/layout/footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping Policy for WeskateCo describing coverage, processing times, estimated delivery times, shipping charges, and tracking.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

const shippingPolicyHtml = `
<p><strong>Effective Date:</strong> June 5, 2025</p>
<p>Thank you for shopping at WeskateCo! We’re committed to delivering your gear as quickly and safely as possible. Please read our shipping policy below:</p>

<h3>Shipping Coverage</h3>
<p>We currently ship to:</p>
<ul>
  <li>All major cities and towns within <strong>India</strong></li>
</ul>

<h3>Processing Time</h3>
<ul>
  <li>Orders are processed within <strong>1–2 business days</strong> (excluding weekends and holidays).</li>
  <li>You’ll receive a confirmation email once your order has been shipped.</li>
</ul>

<h3>Shipping Time Estimates</h3>
<div class="overflow-x-auto my-6">
  <table class="min-w-full text-left border-collapse border border-neutral-700">
    <thead>
      <tr class="bg-neutral-800 text-white">
        <th class="p-3 border border-neutral-700">Location</th>
        <th class="p-3 border border-neutral-700">Estimated Delivery Time</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-3 border border-neutral-700">Within India</td>
        <td class="p-3 border border-neutral-700">3–7 business days</td>
      </tr>
      <tr>
        <td class="p-3 border border-neutral-700">International</td>
        <td class="p-3 border border-neutral-700">N/A</td>
      </tr>
    </tbody>
  </table>
</div>
<p><em>Note: Delivery times may vary due to external factors like courier delays, customs clearance, or weather conditions.</em></p>

<h3>Shipping Charges</h3>
<ul>
  <li><strong>Domestic Orders (India):</strong> Free shipping on all orders</li>
  <li><strong>International Orders:</strong> Calculated at checkout based on destination and weight</li>
</ul>

<h3>Order Tracking</h3>
<p>Once shipped, you’ll receive a tracking link via email. You can monitor your shipment’s progress in real-time.</p>

<h3>Packaging</h3>
<p>We ensure all skateboards, wheels, trucks, and accessories are securely packed to avoid damage during transit.</p>

<h3>Shipping Issues</h3>
<p>If your order:</p>
<ul>
  <li>Arrives damaged</li>
  <li>Is delayed beyond expected timeframe</li>
  <li>Appears lost in transit</li>
</ul>
<p>Please contact us within <strong>7 days</strong> of the estimated delivery date at <a href="mailto:info@weskateco.com">info@weskateco.com</a> with your order number.</p>

<p>Have questions about your order or delivery? Reach out to our support team at <a href="mailto:info@weskateco.com">info@weskateco.com</a>.</p>
`;

export default async function ShippingPolicyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <>
      {/* ── Page header (matches the site content-page pattern) ─────── */}
      <section className="w-full pt-12 pb-8 md:pt-20 md:pb-12 px-4 lg:px-15">
        <div className="mx-auto max-w-(--breakpoint-2xl)">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-neutral-500">
              <li>
                <Link
                  href={locale === "en" ? "/" : `/${locale}`}
                  className="hover:text-black transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </li>
              <li aria-current="page" className="text-black font-medium">
                Shipping Policy
              </li>
            </ol>
          </nav>

          <h1
            className="fluid-text-4xl font-bold tracking-tight"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Shipping Policy
          </h1>
        </div>
      </section>

      {/* ── Policy body ─────────────────────────────────────────────── */}
      <section className="w-full pb-12 md:pb-20 px-4 lg:px-15">
        <div className="mx-auto max-w-(--breakpoint-2xl)">
          <Prose html={shippingPolicyHtml} />
        </div>
      </section>
      <Footer />
    </>
  );
}
