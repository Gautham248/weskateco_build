import OpengraphImage from "components/opengraph-image";
import { getCollection } from "lib/shopify";

export default async function Image(props: {
  params: Promise<{ locale: string; collection: string }>;
}) {
  const params = await props.params;
  const collection = await getCollection(params.collection);
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
