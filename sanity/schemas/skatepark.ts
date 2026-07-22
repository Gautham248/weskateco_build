import { defineType, defineField } from "sanity";

export default defineType({
  name: "skatepark",
  title: "Skatepark",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Park Name",
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
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        { name: "address", title: "Address", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "lat", title: "Latitude", type: "number" },
        { name: "lng", title: "Longitude", type: "number" },
      ],
    }),
    defineField({
      name: "status",
      title: "Construction Status",
      type: "string",
      options: {
        list: [
          { title: "Planning", value: "planning" },
          { title: "Design", value: "design" },
          { title: "Foundation", value: "foundation" },
          { title: "Construction", value: "construction" },
          { title: "Finishing", value: "finishing" },
          { title: "Complete", value: "complete" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completionPercentage",
      title: "Completion Percentage",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
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
      name: "scope_en",
      title: "Project Scope (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "scope_hi",
      title: "Project Scope (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "communityImpact_en",
      title: "Community Impact (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "communityImpact_hi",
      title: "Community Impact (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photos",
      title: "Project Photos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            { name: "caption", title: "Caption", type: "string" },
            {
              name: "stage",
              title: "Construction Stage",
              type: "string",
              options: {
                list: [
                  { title: "Planning", value: "planning" },
                  { title: "Design", value: "design" },
                  { title: "Foundation", value: "foundation" },
                  { title: "Construction", value: "construction" },
                  { title: "Finishing", value: "finishing" },
                  { title: "Complete", value: "complete" },
                ],
              },
            },
          ],
          preview: {
            select: { title: "caption", subtitle: "stage", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "status" },
  },
});
