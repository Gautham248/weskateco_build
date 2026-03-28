import { defineType, defineField } from "sanity";

export default defineType({
  name: "communityStory",
  title: "Community Story",
  type: "document",
  fields: [
    defineField({
      name: "riderName",
      title: "Rider Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "riderName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Rider Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "background_en",
      title: "Background (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "background_hi",
      title: "Background (Hindi)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "story_en",
      title: "Story (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "story_hi",
      title: "Story (Hindi)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "relatedProductHandles",
      title: "Related Product Handles",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedAcademy",
      title: "Related Academy Programme",
      type: "reference",
      to: [{ type: "academyProgramme" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "riderName", media: "portrait" },
  },
});
