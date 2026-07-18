import { defineType, defineField } from "sanity";

export default defineType({
  name: "formSubmission",
  title: "Form Submission",
  type: "document",
  fields: [
    defineField({
      name: "formType",
      title: "Form Type",
      type: "string",
      options: {
        list: [
          { title: "Academy Booking", value: "academy_booking" },
          { title: "B2B Skatepark Enquiry", value: "b2b_skatepark" },
          { title: "Contact Form", value: "contact" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "data",
      title: "Submitted Data",
      type: "object",
      fields: [
        { name: "name", title: "Name", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "message", title: "Message", type: "text" },
        { name: "city", title: "City", type: "string" },
        { name: "budgetRange", title: "Budget Range", type: "string" },
        { name: "projectType", title: "Project Type", type: "string" },
        {
          name: "additionalData",
          title: "Additional Data (JSON)",
          type: "text",
        },
      ],
    }),
    defineField({
      name: "emailSent",
      title: "Email Notification Sent",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "formType", subtitle: "data.name" },
  },
});
