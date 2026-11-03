import { TableKit } from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";

/**
 * Single source of truth for the admin description editor schema.
 *
 * Shopify descriptions can contain specification tables and relative product
 * links, so the schema has to understand both. TipTap silently drops anything
 * the schema does not know about when a description is re-serialized, which is
 * how tables used to disappear the moment an admin edited any other part of a
 * description. The regression test in `scripts/test-admin-editor-tables.ts`
 * builds an editor from this same list so the two can never drift.
 */
export function createEditorExtensions() {
  return [
    StarterKit,
    TableKit.configure({
      table: {
        resizable: true,
        allowTableNodeSelection: true,
      },
    }),
  ];
}
