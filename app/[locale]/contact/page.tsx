import ContactPage from "components/contact/contact-page";
import { withPageMetadata } from "lib/seo/metadata";

export const generateMetadata = withPageMetadata("/contact", {
  title: "Contact Us",
  description:
    "Contact WeSkate Co — skateparks, products, coaching, trade, orders and general enquiries. Every message is routed to the team that owns it.",
});

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

export default async function ContactPageWrapper(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  return <ContactPage locale={locale} />;
}
