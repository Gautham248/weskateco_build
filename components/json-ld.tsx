import { serializeJsonLd } from "lib/seo/json-ld";

/** Renders schema.org structured data as a JSON-LD script tag. */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
