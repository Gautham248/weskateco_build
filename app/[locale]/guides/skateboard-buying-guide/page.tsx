import BoardFinderPage from "components/board-finder/board-finder-page";
import Footer from "components/layout/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const metadata = {
  title: "Skateboard Buying Guide | WeSkate Co",
  description:
    "New to skateboarding, upgrading a setup, or buying for someone else? Answer four questions and walk away with the four numbers that decide how a board rides: deck width, concave, truck width and wheel diameter.",
  openGraph: {
    type: "website",
  },
};

export default async function SkateboardBuyingGuidePage() {
  return (
    <>
      <BoardFinderPage />
      <Footer />
    </>
  );
}
