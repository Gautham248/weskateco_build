import { defineType, defineField } from "sanity";

export default defineType({
  name: "artistCollab",
  title: "Artist Collaboration",
  type: "document",
  fields: [
    defineField({
      name: "artistName",
      title: "Artist Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "artistName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio_en",
      title: "Artist Bio (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "bio_hi",
      title: "Artist Bio (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "artistPhoto",
      title: "Artist Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "creativeProcess_en",
      title: "Creative Process (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "creativeProcess_hi",
      title: "Creative Process (Hindi)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "artworkImages",
      title: "Artwork Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "shopifyProductHandles",
      title: "Shopify Product Handles",
      description: "Enter the Shopify handle for each product in this collaboration",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "countdownDate",
      title: "Drop Date (for countdown)",
      type: "datetime",
    }),
    defineField({
      name: "isLive",
      title: "Collection is Live",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "artistName", media: "artistPhoto" },
  },
});
