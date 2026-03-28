import { defineType, defineField } from "sanity";

export default defineType({
  name: "instructor",
  title: "Instructor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio_en",
      title: "Bio (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "bio_hi",
      title: "Bio (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "style",
      title: "Skating Style",
      type: "string",
      options: {
        list: [
          { title: "Street", value: "street" },
          { title: "Park", value: "park" },
          { title: "Vert", value: "vert" },
          { title: "Cruiser", value: "cruiser" },
          { title: "All-Around", value: "all-around" },
        ],
      },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
