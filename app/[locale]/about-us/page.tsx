import AboutUsContent from "components/about-us/about-us-content";
import Footer from "components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We are a community driven by grit, built on persistence, and united by skateboarding.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AboutUsContent />
      <Footer />
    </div>
  );
}
