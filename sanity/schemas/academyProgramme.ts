import { defineType, defineField } from "sanity";

export default defineType({
  name: "academyProgramme",
  title: "Academy Programme",
  type: "document",
  fields: [
    defineField({
      name: "title_en",
      title: "Title (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_hi",
      title: "Title (Hindi)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
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
      name: "skillLevels",
      title: "Skill Levels",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
    }),
    defineField({
      name: "ageGroups",
      title: "Age Groups",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Kids (6-12)", value: "kids" },
          { title: "Teens (13-17)", value: "teens" },
          { title: "Adults (18+)", value: "adults" },
        ],
      },
    }),
    defineField({
      name: "sessionFormat",
      title: "Session Format",
      type: "string",
      options: {
        list: [
          { title: "Group Class", value: "group" },
          { title: "Private Lesson", value: "private" },
          { title: "Workshop", value: "workshop" },
          { title: "Camp", value: "camp" },
        ],
      },
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bookingEnabled",
      title: "Booking Enabled",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title_en", subtitle: "city" },
  },
});
