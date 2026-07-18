import { defineType, defineField } from "sanity";

export default defineType({
  name: "authorisedBrand",
  title: "Authorised Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
    }),
    defineField({
      name: "description_en",
      title: "Description (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "description_hi",
      title: "Description (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "shopifyCollectionHandle",
      title: "Shopify Collection Handle",
      description: "The Shopify collection handle for this brand's products",
      type: "string",
    }),
    defineField({
      name: "websiteUrl",
      title: "Brand Website",
      type: "url",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
