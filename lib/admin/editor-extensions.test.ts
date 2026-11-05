// @vitest-environment jsdom
// TipTap reads browser globals while ProseMirror parses, so this needs a DOM.
import { Editor } from "@tiptap/core";
import { createEditorExtensions } from "lib/admin/editor-extensions";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

function count(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0;
}

const SHOPIFY_TABLE_HTML = [
  "<h2>Dimensions</h2>",
  "<table>",
  "<thead>",
  "<tr>",
  "<th>Deck</th>",
  "<th>Wheelbase</th>",
  "<th>Wheels</th>",
  "</tr>",
  "</thead>",
  "<tbody>",
  "<tr>",
  '<td><a href="/products/bubblegum-sphere-skateboard-deck">Bubblegum</a></td>',
  "<td>14.5 in</td>",
  "<td>56 mm</td>",
  "</tr>",
  "<tr>",
  "<td>Blank</td>",
  "<td>15.25 in</td>",
  "<td>54 mm</td>",
  "</tr>",
  "</tbody>",
  "</table>",
].join("");

/** Body cell positions, in document order, for the first table. */
function bodyCellPositions(editor: Editor): number[] {
  const positions: number[] = [];

  editor.state.doc.descendants((node, position) => {
    if (node.type.name === "tableCell") {
      positions.push(position);
    }

    return true;
  });

  return positions;
}

function selectFirstBodyCell(editor: Editor) {
  const [first] = bodyCellPositions(editor);

  if (first === undefined) {
    throw new Error("Fixture should contain at least one body cell");
  }

  editor.commands.setTextSelection(first + 2);
}

function selectBodyCellRange(editor: Editor, from: number, to: number) {
  const positions = bodyCellPositions(editor);
  const anchorCell = positions[from];
  const headCell = positions[to];

  if (anchorCell === undefined || headCell === undefined) {
    throw new Error(`No body cells at indexes ${from}..${to}`);
  }

  editor.commands.setCellSelection({ anchorCell, headCell });
}

// These tests share one editor and run in order: each structural edit builds
// on the document the previous test left behind, as it would in the admin UI.
describe("admin description editor", () => {
  let editor: Editor;

  beforeAll(() => {
    editor = new Editor({
      extensions: createEditorExtensions(),
      content: SHOPIFY_TABLE_HTML,
    });
  });

  afterAll(() => {
    editor.destroy();
  });

  describe("round-tripping Shopify HTML", () => {
    let roundTripped: string;

    beforeAll(() => {
      roundTripped = editor.getHTML();
    });

    it("keeps the table element when a description is re-serialized", () => {
      expect(count(roundTripped, /<table/g)).toBe(1);
    });

    it("keeps header cells", () => {
      expect(roundTripped).toContain("<th");
    });

    it("keeps the body row count", () => {
      expect(count(roundTripped, /<tr/g)).toBe(3);
    });

    it("keeps cell count", () => {
      expect(count(roundTripped, /<t[hd]/g)).toBe(9);
    });

    it("keeps relative product links inside table cells", () => {
      expect(roundTripped).toContain(
        'href="/products/bubblegum-sphere-skateboard-deck"',
      );
    });

    it("keeps headings above the table", () => {
      expect(roundTripped).toContain("<h2");
    });
  });

  // Structural edits must be reflected in the saved HTML, otherwise the
  // toolbar buttons are decorative only.
  describe("structural edits", () => {
    it("allows adding a row", () => {
      selectFirstBodyCell(editor);
      expect(editor.commands.addRowAfter()).toBe(true);
    });

    it("adds the row to the serialized HTML", () => {
      expect(count(editor.getHTML(), /<tr/g)).toBe(4);
    });

    let cellsBeforeColumn: number;

    it("allows adding a column", () => {
      cellsBeforeColumn = count(editor.getHTML(), /<t[hd]/g);
      expect(editor.commands.addColumnAfter()).toBe(true);
    });

    it("adds a cell to every row", () => {
      expect(count(editor.getHTML(), /<t[hd]/g)).toBe(cellsBeforeColumn + 4);
    });

    // Merge and split operate on a cell selection, not a text cursor.
    it("allows merging cells", () => {
      selectBodyCellRange(editor, 0, 1);
      expect(editor.commands.mergeCells()).toBe(true);
    });

    it("merge produces a colspan", () => {
      expect(editor.getHTML()).toMatch(/colspan="2"/);
    });

    it("allows splitting a merged cell", () => {
      expect(editor.commands.splitCell()).toBe(true);
    });

    it("split clears the colspan", () => {
      expect(editor.getHTML()).not.toMatch(/colspan="2"/);
    });

    it("allows removing a row", () => {
      expect(editor.commands.deleteRow()).toBe(true);
    });

    it("removes the row from the serialized HTML", () => {
      expect(count(editor.getHTML(), /<tr/g)).toBe(3);
    });

    let cellsBeforeColumnRemoval: number;

    it("allows removing a column", () => {
      cellsBeforeColumnRemoval = count(editor.getHTML(), /<t[hd]/g);
      expect(editor.commands.deleteColumn()).toBe(true);
    });

    it("removes a cell from every row", () => {
      expect(count(editor.getHTML(), /<t[hd]/g)).toBe(
        cellsBeforeColumnRemoval - 3,
      );
    });

    let headerCellsBefore: number;

    it("allows toggling the header row", () => {
      headerCellsBefore = count(editor.getHTML(), /<th/g);
      expect(editor.commands.toggleHeaderRow()).toBe(true);
    });

    it("toggle header changes the header cell type", () => {
      const headerCellsAfter = count(editor.getHTML(), /<th/g);

      // Toggle back before asserting so later tests see the original header.
      editor.commands.toggleHeaderRow();

      expect(headerCellsAfter).not.toBe(headerCellsBefore);
    });

    // Inserting has to happen outside an existing table, otherwise ProseMirror
    // nests the new table inside the current cell.
    it("allows inserting a new table", () => {
      editor.commands.setTextSelection(0);
      expect(
        editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: true }),
      ).toBe(true);
    });

    it("insert adds a header row plus a body row", () => {
      expect(count(editor.getHTML(), /<tr/g)).toBe(5);
    });

    it("allows deleting the table", () => {
      expect(editor.commands.deleteTable()).toBe(true);
    });

    it("delete removes only the new table", () => {
      expect(count(editor.getHTML(), /<table/g)).toBe(1);
    });
  });

  // Reset to Shopify reuses setContent, so it has to survive a round trip too.
  describe("Reset to Shopify", () => {
    beforeAll(() => {
      editor.commands.setContent(SHOPIFY_TABLE_HTML);
    });

    it("restores a table from external content (Reset to Shopify)", () => {
      expect(count(editor.getHTML(), /<table/g)).toBe(1);
    });

    it("Reset to Shopify restores the original rows", () => {
      expect(count(editor.getHTML(), /<tr/g)).toBe(3);
    });

    it("Reset to Shopify restores the product links", () => {
      expect(editor.getHTML()).toContain(
        'href="/products/bubblegum-sphere-skateboard-deck"',
      );
    });
  });
});
