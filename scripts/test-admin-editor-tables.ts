import { Editor } from "@tiptap/core";
import { JSDOM } from "jsdom";
import { createEditorExtensions } from "lib/admin/editor-extensions";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function count(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0;
}

/** TipTap reads browser globals while ProseMirror parses, so install jsdom first. */
function installDom() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
  });

  // Node 26 exposes some of these (notably `navigator`) as getter-only
  // properties, so they have to be redefined rather than assigned.
  function define(name: string, value: unknown) {
    Object.defineProperty(globalThis, name, {
      value,
      configurable: true,
      writable: true,
    });
  }

  define("window", dom.window);
  define("document", dom.window.document);
  define("navigator", dom.window.navigator);
  define("DOMParser", dom.window.DOMParser);
  define("Node", dom.window.Node);
  define("Element", dom.window.Element);
  define("HTMLElement", dom.window.HTMLElement);
  define("NodeFilter", dom.window.NodeFilter);
  define("Range", dom.window.Range);
  define("getSelection", () => dom.window.getSelection());
  define(
    "requestAnimationFrame",
    dom.window.requestAnimationFrame.bind(dom.window),
  );
  define(
    "cancelAnimationFrame",
    dom.window.cancelAnimationFrame.bind(dom.window),
  );

  return dom;
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

function run() {
  console.log("\nadmin description editor");

  const dom = installDom();

  const editor = new Editor({
    extensions: createEditorExtensions(),
    content: SHOPIFY_TABLE_HTML,
  });

  const roundTripped = editor.getHTML();

  check(
    "keeps the table element when a description is re-serialized",
    count(roundTripped, /<table/g) === 1,
    `got ${roundTripped}`,
  );

  check("keeps header cells", roundTripped.includes("<th"));

  check(
    "keeps the body row count",
    count(roundTripped, /<tr/g) === 3,
    `expected 3 rows, got ${count(roundTripped, /<tr/g)}`,
  );

  check(
    "keeps cell count",
    count(roundTripped, /<t[hd]/g) === 9,
    `expected 9 cells, got ${count(roundTripped, /<t[hd]/g)}`,
  );

  check(
    "keeps relative product links inside table cells",
    roundTripped.includes('href="/products/bubblegum-sphere-skateboard-deck"'),
  );

  check("keeps headings above the table", roundTripped.includes("<h2"));

  // Structural edits must be reflected in the saved HTML, otherwise the
  // toolbar buttons are decorative only.
  selectFirstBodyCell(editor);
  check("allows adding a row", editor.commands.addRowAfter());
  check(
    "adds the row to the serialized HTML",
    count(editor.getHTML(), /<tr/g) === 4,
  );

  const cellsBeforeColumn = count(editor.getHTML(), /<t[hd]/g);
  check("allows adding a column", editor.commands.addColumnAfter());
  check(
    "adds a cell to every row",
    count(editor.getHTML(), /<t[hd]/g) === cellsBeforeColumn + 4,
    `expected ${cellsBeforeColumn + 4} cells, got ${count(editor.getHTML(), /<t[hd]/g)}`,
  );

  // Merge and split operate on a cell selection, not a text cursor.
  selectBodyCellRange(editor, 0, 1);
  check("allows merging cells", editor.commands.mergeCells());
  check(
    "merge produces a colspan",
    /colspan="2"/.test(editor.getHTML()),
    editor.getHTML(),
  );

  check("allows splitting a merged cell", editor.commands.splitCell());
  check(
    "split clears the colspan",
    !/colspan="2"/.test(editor.getHTML()),
    editor.getHTML(),
  );

  check("allows removing a row", editor.commands.deleteRow());
  check(
    "removes the row from the serialized HTML",
    count(editor.getHTML(), /<tr/g) === 3,
  );

  const cellsBeforeColumnRemoval = count(editor.getHTML(), /<t[hd]/g);
  check("allows removing a column", editor.commands.deleteColumn());
  check(
    "removes a cell from every row",
    count(editor.getHTML(), /<t[hd]/g) === cellsBeforeColumnRemoval - 3,
  );

  const headerCellsBefore = count(editor.getHTML(), /<th/g);
  check("allows toggling the header row", editor.commands.toggleHeaderRow());
  check(
    "toggle header changes the header cell type",
    count(editor.getHTML(), /<th/g) !== headerCellsBefore,
  );
  editor.commands.toggleHeaderRow();

  // Inserting has to happen outside an existing table, otherwise ProseMirror
  // nests the new table inside the current cell.
  editor.commands.setTextSelection(0);
  check(
    "allows inserting a new table",
    editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: true }),
  );
  check(
    "insert adds a header row plus a body row",
    count(editor.getHTML(), /<tr/g) === 5,
    editor.getHTML(),
  );

  check("allows deleting the table", editor.commands.deleteTable());
  check(
    "delete removes only the new table",
    count(editor.getHTML(), /<table/g) === 1,
    editor.getHTML(),
  );

  // Reset to Shopify reuses setContent, so it has to survive a round trip too.
  editor.commands.setContent(SHOPIFY_TABLE_HTML);
  check(
    "restores a table from external content (Reset to Shopify)",
    count(editor.getHTML(), /<table/g) === 1,
  );
  check(
    "Reset to Shopify restores the original rows",
    count(editor.getHTML(), /<tr/g) === 3,
  );
  check(
    "Reset to Shopify restores the product links",
    editor
      .getHTML()
      .includes('href="/products/bubblegum-sphere-skateboard-deck"'),
  );

  editor.destroy();
  dom.window.close();

  report();
}

function report() {
  console.log(
    failures.length === 0
      ? `\n${passed} passing\n`
      : `\n${passed} passing, ${failures.length} failing\n`,
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

run();
