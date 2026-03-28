# Day 4 — Sanity CMS Integration

**Task**: Set up Sanity CMS v3 with embedded Studio at `/studio`, define all 13 content schemas for WeSkate Co, create GROQ queries, and seed sample content configuration.

**Context**: This is a Next.js 15.6.0-canary.60 App Router project for WeSkate Co (skateboarding brand). Sanity was initialized via CLI — the project (`f25zmr6t`) and dataset (`production`) exist on Sanity's servers, but the CLI failed to create local config files. We need to create them manually. The project uses bare imports (e.g., `import { getCart } from "lib/shopify"` — no `@/` alias). Sanity Studio should be embedded in the Next.js app at the `/studio` route.

**Dependencies already installed**: `sanity`, `@sanity/vision`, `next-sanity`, `@sanity/image-url`. If any are missing, install them with `pnpm add`.

---

## CHANGE 1: Create Sanity configuration files at project root

**Create file**: `sanity.config.ts`

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "weskateco",
  title: "WeSkate Co",
  projectId: "f25zmr6t",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
```

**Create file**: `sanity.cli.ts`

```typescript
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "f25zmr6t",
    dataset: "production",
  },
});
```

---

## CHANGE 2: Create the Sanity client utility

**Create file**: `lib/sanity/client.ts`

```typescript
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

---

## CHANGE 3: Create all Sanity schemas

**Create file**: `sanity/schemas/index.ts`

```typescript
import blogPost from "./blogPost";
import blogCategory from "./blogCategory";
import academyProgramme from "./academyProgramme";
import instructor from "./instructor";
import skatepark from "./skatepark";
import artistCollab from "./artistCollab";
import authorisedBrand from "./authorisedBrand";
import ambassador from "./ambassador";
import ugcSubmission from "./ugcSubmission";
import communityStory from "./communityStory";
import siteSettings from "./siteSettings";
import navigation from "./navigation";
import formSubmission from "./formSubmission";

export const schemaTypes = [
  blogPost,
  blogCategory,
  academyProgramme,
  instructor,
  skatepark,
  artistCollab,
  authorisedBrand,
  ambassador,
  ugcSubmission,
  communityStory,
  siteSettings,
  navigation,
  formSubmission,
];
```

**Create file**: `sanity/schemas/blogCategory.ts`

```typescript
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
```

**Create file**: `sanity/schemas/blogPost.ts`

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
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
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body_en",
      title: "Body (English)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "body_hi",
      title: "Body (Hindi)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title_en", subtitle: "author", media: "mainImage" },
  },
});
```

**Create file**: `sanity/schemas/instructor.ts`

```typescript
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
```

**Create file**: `sanity/schemas/academyProgramme.ts`

```typescript
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
```

**Create file**: `sanity/schemas/skatepark.ts`

```typescript
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
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
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
```

**Create file**: `sanity/schemas/artistCollab.ts`

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "artistCollab",
  title: "Artist Collaboration",
  type: "document",
  fields: [
    defineField({
      name: "artistName",
      title: "Artist Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "artistName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio_en",
      title: "Artist Bio (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "bio_hi",
      title: "Artist Bio (Hindi)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "artistPhoto",
      title: "Artist Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "creativeProcess_en",
      title: "Creative Process (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "creativeProcess_hi",
      title: "Creative Process (Hindi)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "artworkImages",
      title: "Artwork Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "shopifyProductHandles",
      title: "Shopify Product Handles",
      description: "Enter the Shopify handle for each product in this collaboration",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "countdownDate",
      title: "Drop Date (for countdown)",
      type: "datetime",
    }),
    defineField({
      name: "isLive",
      title: "Collection is Live",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "artistName", media: "artistPhoto" },
  },
});
```

**Create file**: `sanity/schemas/authorisedBrand.ts`

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "authorisedBrand",
  title: "Authorised Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
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
      name: "logo",
      title: "Brand Logo",
      type: "image",
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
      name: "shopifyCollectionHandle",
      title: "Shopify Collection Handle",
      description: "The Shopify collection handle for this brand's products",
      type: "string",
    }),
    defineField({
      name: "websiteUrl",
      title: "Brand Website",
      type: "url",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort Order", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
```

**Create file**: `sanity/schemas/ambassador.ts`

```typescript
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
      description: "Links this ambassador to their Shopify customer account for perks",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tier", media: "photo" },
  },
});
```

**Create file**: `sanity/schemas/ugcSubmission.ts`

```typescript
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
```

**Create file**: `sanity/schemas/communityStory.ts`

```typescript
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
```

**Create file**: `sanity/schemas/siteSettings.ts`

```typescript
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
```

**Create file**: `sanity/schemas/navigation.ts`

```typescript
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
                    { name: "label_en", title: "Label (English)", type: "string" },
                    { name: "label_hi", title: "Label (Hindi)", type: "string" },
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
```

**Create file**: `sanity/schemas/formSubmission.ts`

```typescript
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
        { name: "additionalData", title: "Additional Data (JSON)", type: "text" },
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
    { title: "Newest First", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "formType", subtitle: "data.name" },
  },
});
```

---

### CHANGE 4: Create the embedded Sanity Studio route

**Create file**: `app/studio/[[...tool]]/page.tsx`

```typescript
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

**Create file**: `app/studio/[[...tool]]/layout.tsx`

```typescript
export const metadata = {
  title: "WeSkate Co — Content Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
```

**IMPORTANT**: The Studio route is at `app/studio/`, NOT `app/[locale]/studio/`. It sits outside the locale routing entirely — the `proxy.ts` config already skips `/studio` paths.

---

### CHANGE 5: Create GROQ queries

**Create file**: `lib/sanity/queries.ts`

```typescript
export const getBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title_en,
    title_hi,
    slug,
    author,
    publishedAt,
    seoTitle,
    seoDescription,
    "category": category->{ name_en, name_hi, slug },
    tags,
    "mainImageUrl": mainImage.asset->url
  }
`;

export const getBlogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title_en,
    title_hi,
    slug,
    author,
    publishedAt,
    body_en,
    body_hi,
    seoTitle,
    seoDescription,
    "category": category->{ name_en, name_hi, slug },
    tags,
    "mainImageUrl": mainImage.asset->url
  }
`;

export const getBlogCategoriesQuery = `
  *[_type == "blogCategory"] | order(name_en asc) {
    _id,
    name_en,
    name_hi,
    slug,
    description_en,
    description_hi
  }
`;

export const getAcademyProgrammesQuery = `
  *[_type == "academyProgramme"] | order(city asc) {
    _id,
    title_en,
    title_hi,
    slug,
    description_en,
    description_hi,
    skillLevels,
    ageGroups,
    sessionFormat,
    city,
    bookingEnabled,
    "instructor": instructor->{ name, bio_en, bio_hi, "photoUrl": photo.asset->url },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

export const getSkateparksQuery = `
  *[_type == "skatepark"] | order(name asc) {
    _id,
    name,
    slug,
    location,
    status,
    completionPercentage,
    description_en,
    description_hi,
    scope_en,
    scope_hi,
    communityImpact_en,
    communityImpact_hi,
    "featuredImageUrl": featuredImage.asset->url,
    photos[] {
      caption,
      stage,
      "imageUrl": image.asset->url
    }
  }
`;

export const getArtistCollabsQuery = `
  *[_type == "artistCollab"] | order(_createdAt desc) {
    _id,
    artistName,
    slug,
    bio_en,
    bio_hi,
    "artistPhotoUrl": artistPhoto.asset->url,
    artworkImages[] { "url": asset->url },
    shopifyProductHandles,
    countdownDate,
    isLive
  }
`;

export const getArtistCollabBySlugQuery = `
  *[_type == "artistCollab" && slug.current == $slug][0] {
    _id,
    artistName,
    slug,
    bio_en,
    bio_hi,
    "artistPhotoUrl": artistPhoto.asset->url,
    creativeProcess_en,
    creativeProcess_hi,
    artworkImages[] { "url": asset->url },
    shopifyProductHandles,
    countdownDate,
    isLive
  }
`;

export const getAuthorisedBrandsQuery = `
  *[_type == "authorisedBrand"] | order(sortOrder asc) {
    _id,
    name,
    slug,
    "logoUrl": logo.asset->url,
    description_en,
    description_hi,
    shopifyCollectionHandle,
    websiteUrl
  }
`;

export const getAmbassadorsQuery = `
  *[_type == "ambassador"] | order(tier desc, name asc) {
    _id,
    name,
    slug,
    location,
    ridingStyle,
    tier,
    "photoUrl": photo.asset->url,
    bio_en,
    bio_hi,
    socialHandle,
    featuredContent
  }
`;

export const getApprovedUgcQuery = `
  *[_type == "ugcSubmission" && status in ["approved", "featured"]] | order(featuredDate desc, _createdAt desc) {
    _id,
    customerName,
    instagramHandle,
    imageUrl,
    "uploadedImageUrl": image.asset->url,
    productReferences,
    status,
    featuredDate
  }
`;

export const getCommunityStoriesQuery = `
  *[_type == "communityStory"] | order(publishedAt desc) {
    _id,
    riderName,
    slug,
    "portraitUrl": portrait.asset->url,
    background_en,
    background_hi,
    relatedProductHandles,
    publishedAt
  }
`;

export const getCommunityStoryBySlugQuery = `
  *[_type == "communityStory" && slug.current == $slug][0] {
    _id,
    riderName,
    slug,
    "portraitUrl": portrait.asset->url,
    background_en,
    background_hi,
    story_en,
    story_hi,
    relatedProductHandles,
    "relatedAcademy": relatedAcademy->{ title_en, title_hi, slug, city },
    publishedAt
  }
`;

export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    announcementBar_en,
    announcementBar_hi,
    announcementBarEnabled,
    contactEmail,
    contactPhone,
    socialLinks,
    footerText_en,
    footerText_hi
  }
`;

export const getNavigationQuery = `
  *[_type == "navigation" && identifier == $identifier][0] {
    identifier,
    items[] {
      label_en,
      label_hi,
      href,
      children[] {
        label_en,
        label_hi,
        href
      }
    }
  }
`;
```

---

### CHANGE 6: Update `proxy.ts` to skip `/studio` path

Check the existing `proxy.ts`. It should already skip `/studio` paths based on the Day 3 implementation. If the skip list does NOT include `/studio`, add it:

```typescript
if (
  pathname.startsWith("/api") ||
  pathname.startsWith("/_next") ||
  pathname.startsWith("/favicon.ico") ||
  pathname.startsWith("/robots.txt") ||
  pathname.startsWith("/sitemap.xml") ||
  pathname.startsWith("/studio")  // <-- ensure this exists
) {
  return NextResponse.next();
}
```

---

### VERIFICATION

1. Run `pnpm build` — should compile without errors
2. Run `pnpm dev`
3. Navigate to `localhost:3000/studio` — Sanity Studio should load showing all 13 document types in the left sidebar: Blog Post, Blog Category, Academy Programme, Instructor, Skatepark, Artist Collaboration, Authorised Brand, Ambassador, UGC Submission, Community Story, Site Settings, Navigation, Form Submission
4. Click on "Skatepark" in the sidebar — you should see the form with fields including the "Construction Status" dropdown with options: Planning, Design, Foundation, Construction, Finishing, Complete
5. Click on "Ambassador" — you should see the "Ambassador Tier" radio buttons: Community Rider, Team Rider, Ambassador
6. Click on "UGC Submission" — you should see the "Moderation Status" radio: Pending, Approved, Featured, Rejected
7. Verify the cart still works (Studio route should not interfere with commerce routes)
8. Verify `localhost:3000/search` still loads products normally

**Do NOT create any sample content in Sanity Studio during verification.** Just confirm the Studio loads and all schemas are visible with the correct field types.

### FILES CREATED

- `sanity.config.ts`
- `sanity.cli.ts`
- `lib/sanity/client.ts`
- `lib/sanity/queries.ts`
- `sanity/schemas/index.ts`
- `sanity/schemas/blogPost.ts`
- `sanity/schemas/blogCategory.ts`
- `sanity/schemas/instructor.ts`
- `sanity/schemas/academyProgramme.ts`
- `sanity/schemas/skatepark.ts`
- `sanity/schemas/artistCollab.ts`
- `sanity/schemas/authorisedBrand.ts`
- `sanity/schemas/ambassador.ts`
- `sanity/schemas/ugcSubmission.ts`
- `sanity/schemas/communityStory.ts`
- `sanity/schemas/siteSettings.ts`
- `sanity/schemas/navigation.ts`
- `sanity/schemas/formSubmission.ts`
- `app/studio/[[...tool]]/page.tsx`
- `app/studio/[[...tool]]/layout.tsx`

### FILES MODIFIED

- `proxy.ts` (only if `/studio` skip was missing)

List every file created and modified when done.

---
