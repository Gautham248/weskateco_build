import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "name_en",
      title: "Name (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name_hi",
      title: "Name (Hindi)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name_en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description_en",
      title: "Description (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description_hi",
      title: "Description (Hindi)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name_en" },
  },
});
