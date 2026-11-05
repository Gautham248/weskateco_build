import AboutUsContent from "components/about-us/about-us-content";
import BrandsSection from "components/about-us/brands-section";
import OneLastTrySection from "components/about-us/one-last-try-section";
import OriginStorySection from "components/about-us/origin-story-section";
import PeopleBehindHero from "components/about-us/people-behind-hero";
import PeopleBehindStory from "components/about-us/people-behind-story";
import ValuesSection from "components/about-us/values-section";
import Footer from "components/layout/footer";
import { withPageMetadata } from "lib/seo/metadata";

export const generateMetadata = withPageMetadata("/about-us", {
  title: "About Us",
  description:
    "We are a community driven by grit, built on persistence, and united by skateboarding.",
});

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* The banner is an image, so the page's main heading is visually hidden */}
      <h1 className="sr-only">About WeSkate Co</h1>
      <AboutUsContent />
      <OriginStorySection />
      <PeopleBehindHero />
      <PeopleBehindStory />
      <BrandsSection />
      <OneLastTrySection />
      <ValuesSection />
      <Footer />
    </div>
  );
}
