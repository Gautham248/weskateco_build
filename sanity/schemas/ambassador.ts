import { defineType, defineField } from "sanity";

export default defineType({
  name: "ambassador",
  title: "Ambassador",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "location",
      title: "Location / City",
      type: "string",
    }),
    defineField({
      name: "ridingStyle",
      title: "Riding Style",
      type: "string",
      options: {
        list: [
          { title: "Street", value: "street" },
          { title: "Park", value: "park" },
          { title: "Vert", value: "vert" },
          { title: "Cruiser", value: "cruiser" },
          { title: "Surfskate", value: "surfskate" },
          { title: "All-Around", value: "all-around" },
        ],
      },
    }),
    defineField({
      name: "tier",
      title: "Ambassador Tier",
      type: "string",
      options: {
        list: [
          { title: "Community Rider", value: "community_rider" },
          { title: "Team Rider", value: "team_rider" },
          { title: "Ambassador", value: "ambassador" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
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
      name: "socialHandle",
      title: "Instagram Handle",
      type: "string",
    }),
    defineField({
      name: "featuredContent",
      title: "Featured Content URLs",
      description: "Instagram post URLs or other featured content",
      type: "array",
      of: [{ type: "url" }],
    }),
    defineField({
      name: "shopifyCustomerId",
      title: "Shopify Customer ID",
      description:
        "Links this ambassador to their Shopify customer account for perks",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tier", media: "photo" },
  },
});
