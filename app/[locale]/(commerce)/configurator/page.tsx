import { getConfiguratorProducts } from "lib/shopify";
import { ConfiguratorWizard } from "components/configurator/wizard";
import { createTranslator } from "lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const t = createTranslator(params.locale);
  return {
    title: t("configurator.title"),
    description: "Build your perfect skateboard setup with the WeSkate configurator.",
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ConfiguratorWizard products={products} locale={params.locale} />
    </div>
  );
}
