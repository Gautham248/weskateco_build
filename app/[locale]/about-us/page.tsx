import AboutUsContent from "components/about-us/about-us-content";
import BrandsSection from "components/about-us/brands-section";
import OneLastTrySection from "components/about-us/one-last-try-section";
import OriginStorySection from "components/about-us/origin-story-section";
import PeopleBehindStory from "components/about-us/people-behind-story";
import ValuesSection from "components/about-us/values-section";
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
      <OriginStorySection />
      <PeopleBehindStory />
      <BrandsSection />
      <OneLastTrySection />
      <ValuesSection />
      <Footer />
    </div>
  );
}
