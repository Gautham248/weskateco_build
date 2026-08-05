import Prose from "components/prose";
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

<h3>🚚 Shipping Coverage</h3>
<p>We currently ship to:</p>
<ul>
  <li>All major cities and towns within <strong>India</strong></li>
</ul>

<h3>⏱️ Processing Time</h3>
<ul>
  <li>Orders are processed within <strong>1–2 business days</strong> (excluding weekends and holidays).</li>
  <li>You’ll receive a confirmation email once your order has been shipped.</li>
</ul>

<h3>📦 Shipping Time Estimates</h3>
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

<h3>💰 Shipping Charges</h3>
<ul>
  <li><strong>Domestic Orders (India):</strong> Free shipping on all orders</li>
  <li><strong>International Orders:</strong> Calculated at checkout based on destination and weight</li>
</ul>

<h3>📦 Order Tracking</h3>
<p>Once shipped, you’ll receive a tracking link via email. You can monitor your shipment’s progress in real-time.</p>

<h3>📦 Packaging</h3>
<p>We ensure all skateboards, wheels, trucks, and accessories are securely packed to avoid damage during transit.</p>

<h3>🚨 Shipping Issues</h3>
<p>If your order:</p>
<ul>
  <li>Arrives damaged</li>
  <li>Is delayed beyond expected timeframe</li>
  <li>Appears lost in transit</li>
</ul>
<p>Please contact us within <strong>7 days</strong> of the estimated delivery date at <a href="mailto:info@weskateco.com">info@weskateco.com</a> with your order number.</p>

<p>Have questions about your order or delivery? Reach out to our support team at <a href="mailto:info@weskateco.com">info@weskateco.com</a>.</p>
`;

import Footer from "components/layout/footer";

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-16">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-5xl">
          Shipping Policy
        </h1>
        <Prose className="mb-8" html={shippingPolicyHtml} />
      </div>
      <Footer />
    </>
  );
}
