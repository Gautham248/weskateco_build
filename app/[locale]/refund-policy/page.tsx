import Prose from "components/prose";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund Policy for WESKATECO / Toucan Distribution Private Limited describing returns, replacements, non-returnable items, and refund procedures.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

const refundPolicyHtml = `
<p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>

<p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>

<p>To start a return, you can contact us at <a href="mailto:info@weskateco.com">info@weskateco.com</a>. Please note that returns will need to be sent to the following address:</p>

<div class="my-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
  <strong>Toucan Distribution Pvt Ltd</strong><br />
  No 149/3, 5th Main Rd, Malleshpalya<br />
  Behind DS Upahara, Kaggadasapura<br />
  Bangalore, Karnataka 560075, India
</div>

<p>If a defective item was delivered to the customer, we will pay for return shipping and provide a shipping label. In other cases, the customer is responsible for return shipping. Items sent back to us without first requesting a return will not be accepted.</p>

<p>You can always contact us for any return question at <a href="mailto:info@weskateco.com">info@weskateco.com</a>.</p>

<h2>Damages and issues</h2>
<p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>

<h2>Exchanges</h2>
<p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>

<h2>European Union 14 day cooling off period</h2>
<p>Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>

<h2>Refunds</h2>
<p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 7 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
<p>If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:info@weskateco.com">info@weskateco.com</a>.</p>

<p>Thank you for shopping with WESKATECO, operated by Toucan Distribution Private Limited. We’re committed to your satisfaction, and we want to ensure a smooth and transparent return and refund experience for all our customers.</p>

<h3>1. Returns Eligibility</h3>
<p>You can request a return or replacement within 30 days of receiving your order if:</p>
<ul>
  <li>The item is defective, damaged, or incorrect</li>
  <li>You received the wrong size/model</li>
  <li>The item is unused, in original condition, and in original packaging</li>
</ul>
<p>Please note: Used, customized, or worn products cannot be returned unless there is a manufacturing defect.</p>

<h3>2. Non-Returnable Items</h3>
<p>The following items are not eligible for return or refund:</p>
<ul>
  <li>Gripped skateboards that show signs of use</li>
  <li>Safety gear (helmets, pads) that have been worn</li>
  <li>Items bought on clearance sale</li>
  <li>Gift cards or promotional vouchers</li>
</ul>

<h3>3. Refunds</h3>
<ul>
  <li>Refunds are processed only after the returned item passes quality inspection.</li>
  <li>Refunds will be credited to your original method of payment within 7–10 business days after approval.</li>
  <li>In case of prepaid orders with COD return requests, we may ask for your bank details for a direct refund.</li>
</ul>

<h3>4. Replacements</h3>
<p>We offer free replacements for eligible items that are damaged or defective at the time of delivery. Please reach out to our team within 48 hours of receiving the item.</p>

<h3>5. How to Request a Return</h3>
<p>To initiate a return or refund:</p>
<ol>
  <li>Email us at <a href="mailto:info@weskateco.com">info@weskateco.com</a> with:
    <ul>
      <li>Your order number</li>
      <li>Photos of the item (if damaged/defective)</li>
      <li>Reason for return</li>
    </ul>
  </li>
  <li>Our support team will guide you through the next steps, including pickup or drop-off instructions.</li>
</ol>

<h3>6. Return Shipping</h3>
<ul>
  <li>If the return is due to our error (e.g., wrong or defective product), return shipping will be free of cost.</li>
  <li>For other cases, return shipping charges may be deducted from your refund or borne by the customer.</li>
</ul>

<h3>7. Cancellation Policy</h3>
<ul>
  <li>Orders can be canceled before they are shipped by emailing us at <a href="mailto:info@weskateco.com">info@weskateco.com</a>.</li>
  <li>If already shipped, the order can be returned after delivery following our return process.</li>
</ul>

<h3>8. Contact Us</h3>
<p>For any issues related to returns or refunds, please contact:</p>
<p>
  <strong>Toucan Distribution Private Limited</strong><br />
  Email: <a href="mailto:info@weskateco.com">info@weskateco.com</a><br />
  Website: <a href="https://www.weskateco.com" target="_blank" rel="noopener noreferrer">www.weskateco.com</a>
</p>
`;

import Footer from "components/layout/footer";

export default function RefundPolicyPage() {
  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-16">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-5xl">
          Refund Policy
        </h1>
        <Prose className="mb-8" html={refundPolicyHtml} />
      </div>
      <Footer />
    </>
  );
}
