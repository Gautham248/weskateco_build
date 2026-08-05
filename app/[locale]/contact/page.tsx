import Prose from "components/prose";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact information for WeskateCo. Reach out to us via Email, Call, or WhatsApp.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

const contactUsHtml = `
<p class="text-lg font-medium">Email, Call or Whatsapp us</p>
<p><strong>Phone/Whatsapp:</strong> <a href="https://wa.me/917204593003" target="_blank" rel="noopener noreferrer">7204593003</a></p>
<p><strong>Email:</strong> <a href="mailto:info@weskateco.com">info@weskateco.com</a></p>
<p>We look forward to speaking with you.</p>
`;

import Footer from "components/layout/footer";

export default function ContactPage() {
  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-16">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-5xl">
          Contact Us
        </h1>
        <Prose className="mb-8" html={contactUsHtml} />
      </div>
      <Footer />
    </>
  );
}
