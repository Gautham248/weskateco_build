import type { Metadata } from "next";

import Prose from "components/prose";
import { getPage } from "lib/shopify";
import { notFound } from "next/navigation";
import {
  documentTitle,
  localeAlternates,
  openGraph,
  socialTitle,
  summarize,
} from "lib/seo/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  const title = page.seo?.title || page.title;
  // A merchant-written SEO description is used as written
  const description = page.seo?.description || summarize(page.bodySummary);
  const path = `/${page.handle}`;

  return {
    title: documentTitle(title),
    description,
    alternates: localeAlternates(path, params.locale),
    openGraph: openGraph(params.locale, path, {
      type: "article",
      title: socialTitle(title),
      description,
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
    }),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.body} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        ).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
