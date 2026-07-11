import TipsSection from "components/home/tips-section";
import Footer from "components/layout/footer";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

export default async function SearchLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children } = props;

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 pb-4 text-black dark:text-white min-h-screen w-full">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <TipsSection />
      <Footer />
    </>
  );
}