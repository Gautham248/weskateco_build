import OpengraphImage from "components/opengraph-image";

export default async function Image(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  return await OpengraphImage();
}
