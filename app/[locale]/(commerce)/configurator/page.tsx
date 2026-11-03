import { getConfiguratorProducts } from "lib/shopify";
import { ConfiguratorWizard } from "components/configurator/wizard";
import { createTranslator } from "lib/i18n";
import {
  localeAlternates,
  openGraph,
  siteShareImage,
  socialTitle,
} from "lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const t = createTranslator(params.locale);
  const title = t("configurator.title");
  const description =
    "Build your perfect skateboard setup with the WeSkate configurator.";
  return {
    title,
    description,
    alternates: localeAlternates("/configurator", params.locale),
    openGraph: openGraph(params.locale, "/configurator", {
      images: siteShareImage(params.locale),
      title: socialTitle(title),
      description,
    }),
  };
}

export default async function ConfiguratorPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  let products: any[] = [];

  try {
    products = await getConfiguratorProducts();
  } catch (error) {
    console.error("Failed to fetch configurator products:", error);
  }

  return (
    <div className="w-full">
      <ConfiguratorWizard products={products} locale={params.locale} />
    </div>
  );
}
