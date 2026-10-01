import FooterClient from "components/layout/footer-client";
import { getSiteSettings } from "lib/sanity/site-settings";

/**
 * Server wrapper that reads the CMS-managed social handles and hands them to
 * the client footer.
 *
 * Every page renders `<Footer />` with no props, and keeping that signature
 * means no call site had to change. The footer itself has to stay a client
 * component because the mobile Shop accordion uses state, so the Sanity read
 * lives here instead.
 */
export default async function Footer() {
  const { socialLinks } = await getSiteSettings();

  return <FooterClient socialLinks={socialLinks} />;
}
