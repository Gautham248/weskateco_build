---

**Task**: Fix the "Tool not found: studio" error in the embedded Sanity Studio at `/studio`.

**Context**: Sanity Studio is embedded in a Next.js 15.6.0-canary.60 App Router project at `app/studio/[[...tool]]/`. The Studio loads (the top bar with "WeSkate Co", "Structure", "Vision", "Releases" is visible) but shows "Tool not found: studio" in the main content area. This happens because the catch-all route `[[...tool]]` passes "studio" as the tool name to Sanity, but Sanity's registered tools are "structure" and "vision" — there is no tool called "studio".

**Root cause**: When a user visits `/studio`, the Next.js catch-all route captures the path segments. The `[[...tool]]` parameter receives an empty array for `/studio` (correct), but the `NextStudio` component then interprets the base path incorrectly, thinking "studio" is a tool name rather than the base path.

**What to do**:

### Fix 1: Update the Studio page component

**Modify file**: `app/studio/[[...tool]]/page.tsx`

Replace the entire contents with:

```typescript
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} basePath="/studio" />;
}
```

The key addition is `basePath="/studio"`. This tells `NextStudio` that "/studio" is the base path for the Studio, not a tool name. Without it, the Studio doesn't know to strip "/studio" from the URL before resolving tools.

### Fix 2: Verify the Studio layout doesn't interfere

**Check file**: `app/studio/[[...tool]]/layout.tsx`

Ensure it looks like this (no extra wrappers or providers that could interfere):

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

If the layout has any other providers or wrappers, remove them. The Studio needs a clean HTML shell — no `CartProvider`, no `TranslationProvider`, nothing from the main app layout.

### Verification

1. Run `pnpm dev`
2. Navigate to `localhost:3001/studio` (clean URL, no query params)
3. The Studio should load with the left sidebar showing all 13 document types
4. Click "Structure" in the top nav — should show the document type list
5. Click "Vision" in the top nav — should show the GROQ query playground
6. Click on any document type (e.g., "Skatepark") — should show the creation form with all fields
7. Navigate to `localhost:3001/search` — main commerce site should still work

### Files modified
- `app/studio/[[...tool]]/page.tsx`

List changes when done.

---