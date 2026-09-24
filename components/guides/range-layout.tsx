import type { ReactNode } from "react";
import GuideCrosslink from "./callout";
import { Container, Section, SectionHeader } from "./ui";

/**
 * Shared skeleton for the deck/truck/griptape guides' "The range" section:
 * the `id="range"` band, the SectionHeader built from the section's data,
 * the guide-specific middle (table / prose / product grid passed as
 * children), and the configurator crosslink callout.
 *
 * The wheel guide's range is deliberately NOT built on this — its callout
 * has a different responsive treatment (a separate mobile-only link) and its
 * note is plain styled text rather than the shared bordered Note.
 */
export function RangeLayout({
  bg = "white",
  header,
  crosslink,
  children,
}: {
  bg?: "white" | "muted";
  header: { kicker: string; title: string; intro: string };
  crosslink: { text: string; cta: string; href: string };
  children: ReactNode;
}) {
  return (
    <Section id="range" bg={bg}>
      <Container>
        <SectionHeader {...header} />
        {children}
        <GuideCrosslink {...crosslink} />
      </Container>
    </Section>
  );
}
