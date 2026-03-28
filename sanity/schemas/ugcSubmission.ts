import { defineType, defineField } from "sanity";

export default defineType({
  name: "ugcSubmission",
  title: "UGC Submission",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string",
    }),
    defineField({
      name: "imageUrl",
      title: "Image / Video URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Uploaded Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "productReferences",
      title: "Related Product Handles",
      description: "Shopify product handles featured in this content",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "status",
      title: "Moderation Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Featured", value: "featured" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredDate",
      title: "Featured Date",
      type: "datetime",
    }),
    defineField({
      name: "moderationNotes",
      title: "Moderation Notes",
      description: "Internal notes — not shown publicly",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    { title: "Newest First", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "customerName", subtitle: "status", media: "image" },
  },
});
