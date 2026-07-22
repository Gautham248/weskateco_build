import { defineType, defineField } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "identifier",
      title: "Identifier",
      description: "e.g. 'header' or 'footer'",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label_en", title: "Label (English)", type: "string" },
            { name: "label_hi", title: "Label (Hindi)", type: "string" },
            { name: "href", title: "Link URL", type: "string" },
            {
              name: "children",
              title: "Dropdown Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "label_en",
                      title: "Label (English)",
                      type: "string",
                    },
                    {
                      name: "label_hi",
                      title: "Label (Hindi)",
                      type: "string",
                    },
                    { name: "href", title: "Link URL", type: "string" },
                  ],
                  preview: {
                    select: { title: "label_en", subtitle: "href" },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: "label_en", subtitle: "href" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "identifier" },
  },
});
