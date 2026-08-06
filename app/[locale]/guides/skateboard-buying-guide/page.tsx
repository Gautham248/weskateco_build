import AreYouABeginnerSection from "components/guides/are-you-a-beginner";
import BuildYourOwnOrBuyCompleteSection from "components/guides/build-your-own-or-buy-complete";
import SkateboardBuyingGuideHeroBanner from "components/guides/skateboard-buying-guide-banner";
import WhatAboutMaintenanceSection from "components/guides/what-about-maintenance";
import WhatSizeShouldIGetSection from "components/guides/what-size-should-i-get";
import WhatsYourStyleSection from "components/guides/whats-your-style";
import YourQuickChecklistSection from "components/guides/your-quick-checklist";
import Footer from "components/layout/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Skateboard Buying Guide | WeSkate Co",
  description:
    "This guide will help you choose the right skateboard - whether you're a beginner, upgrading your setup, or buying for someone else.",
  openGraph: {
    type: "website",
  },
};

export default async function SkateboardBuyingGuidePage() {
  return (
    <>
      <SkateboardBuyingGuideHeroBanner />
      <AreYouABeginnerSection />
      <WhatSizeShouldIGetSection />
      <WhatsYourStyleSection />
      <BuildYourOwnOrBuyCompleteSection />
      <WhatAboutMaintenanceSection />
      <YourQuickChecklistSection />
      <Footer />
    </>
  );
}
