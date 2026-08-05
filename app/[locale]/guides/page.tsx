import { getLocalizedPath } from "lib/i18n";
import { redirect } from "next/navigation";

export default async function GuidesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  redirect(getLocalizedPath("/guides/skateboard-buying-guide", locale));
}
