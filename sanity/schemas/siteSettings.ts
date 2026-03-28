import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "announcementBar_en",
      title: "Announcement Bar Text (English)",
      type: "string",
    }),
    defineField({
      name: "announcementBar_hi",
      title: "Announcement Bar Text (Hindi)",
      type: "string",
    }),
    defineField({
      name: "announcementBarEnabled",
      title: "Show Announcement Bar",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "twitter", title: "Twitter / X", type: "url" },
      ],
    }),
    defineField({
      name: "footerText_en",
      title: "Footer Text (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerText_hi",
      title: "Footer Text (Hindi)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
