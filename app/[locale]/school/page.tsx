import Footer from "components/layout/footer";
import BeyondClassesSection from "components/school/beyond-classes-section";
import ClassroomSection from "components/school/classroom-section";
import SchoolHeroBanner from "components/school/hero-banner";
import JourneySection from "components/school/journey-section";
import MoreThanSportSection from "components/school/more-than-sport";
import NoSkateparkSection from "components/school/no-skatepark-section";
import OurImpactSection from "components/school/our-impact-section";
import SafeStructuredSection from "components/school/safe-structured-section";
import WhySchoolsChooseSection from "components/school/why-schools-choose";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "WeSkate School | WeSkate Co",
  description: "Learn skateboarding and surfskating with WeSkate School.",
  openGraph: {
    type: "website",
  },
};

export default async function SchoolPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <>
      <SchoolHeroBanner locale={locale} />
      <ClassroomSection />
      <MoreThanSportSection />
      <WhySchoolsChooseSection />
      <JourneySection />
      <SafeStructuredSection />
      <NoSkateparkSection />
      <OurImpactSection />
      <BeyondClassesSection />
      <Footer />
    </>
  );
}
