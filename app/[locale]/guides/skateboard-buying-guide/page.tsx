import BoardFinderPage from "components/board-finder/board-finder-page";
import Footer from "components/layout/footer";
import { guideMetadata } from "lib/guides/metadata";
import { withPageMetadata } from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const generateMetadata = withPageMetadata(
  "/guides/skateboard-buying-guide",
  guideMetadata(
    "Skateboard Buying Guide",
    "New to skateboarding, upgrading a setup, or buying for someone else? Answer four questions and walk away with the four numbers that decide how a board rides: deck width, concave, truck width and wheel diameter.",
  ),
);

export default async function SkateboardBuyingGuidePage() {
  return (
    <>
      <BoardFinderPage />
      <Footer />
    </>
  );
}
