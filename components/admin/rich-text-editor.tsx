"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";
import { createEditorExtensions } from "lib/admin/editor-extensions";

type ToolbarButton = {
  label: string;
  title: string;
  group: "format" | "table" | "table-destroy";
  isActive: () => boolean;
  isDisabled?: () => boolean;
  run: () => void;
};

const editorClasses =
  "tiptap prose prose-sm max-w-none min-h-[240px] px-3 py-3 text-sm leading-relaxed focus:outline-none prose-headings:font-semibold prose-p:my-2 [&_.tableWrapper]:my-4 [&_.tableWrapper]:max-w-full [&_.tableWrapper]:overflow-x-auto [&_table]:min-w-[32rem]";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const lastEmittedHtml = useRef<string | null>(null);
  const hasSyncedInitialContent = useRef(false);

  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: value,
    // Required under SSR: rendering immediately causes a hydration mismatch
    // because TipTap builds its document from the browser DOM.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: editorClasses },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      lastEmittedHtml.current = html;
      onChange(html);
    },
  });

  // TipTap only consumes `content` when the editor is created. Sync later
  // external changes (Reset to Shopify, override deletion) without feeding the
  // editor's own onUpdate emissions back into itself.
  useEffect(() => {
    if (!editor) return;

    if (!hasSyncedInitialContent.current) {
      hasSyncedInitialContent.current = true;
      lastEmittedHtml.current = editor.getHTML();
      return;
    }

    if (value === lastEmittedHtml.current) return;

    if (editor.getHTML() === value) {
      lastEmittedHtml.current = value;
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
    lastEmittedHtml.current = editor.getHTML();
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[288px] animate-pulse rounded-sm border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900" />
    );
  }

  const buttons: ToolbarButton[] = [
    {
      label: "B",
      title: "Bold",
      group: "format",
      isActive: () => editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      title: "Italic",
      group: "format",
      isActive: () => editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "S",
      title: "Strikethrough",
      group: "format",
      isActive: () => editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "H2",
      title: "Heading 2",
      group: "format",
      isActive: () => editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      title: "Heading 3",
      group: "format",
      isActive: () => editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "• List",
      title: "Bullet list",
      group: "format",
      isActive: () => editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1. List",
      title: "Numbered list",
      group: "format",
      isActive: () => editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      title: "Blockquote",
      group: "format",
      isActive: () => editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Table +",
      title: "Insert a 3 × 3 table with a header row",
      group: "table",
      isActive: () => false,
      isDisabled: () =>
        !editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
      run: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      label: "Row +",
      title: "Add row below",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().addRowAfter(),
      run: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Row −",
      title: "Delete current row",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().deleteRow(),
      run: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: "Col +",
      title: "Add column to the right",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().addColumnAfter(),
      run: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Col −",
      title: "Delete current column",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().deleteColumn(),
      run: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      label: "Header",
      title: "Toggle header row",
      group: "table",
      isActive: () => editor.isActive("tableHeader"),
      isDisabled: () => !editor.can().toggleHeaderRow(),
      run: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: "Merge",
      title: "Merge selected cells",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().mergeCells(),
      run: () => editor.chain().focus().mergeCells().run(),
    },
    {
      label: "Split",
      title: "Split selected cell",
      group: "table",
      isActive: () => false,
      isDisabled: () => !editor.can().splitCell(),
      run: () => editor.chain().focus().splitCell().run(),
    },
    {
      label: "Delete table",
      title: "Delete the entire table",
      group: "table-destroy",
      isActive: () => false,
      isDisabled: () => !editor.can().deleteTable(),
      run: () => editor.chain().focus().deleteTable().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-300 dark:border-neutral-700">
      <div className="flex flex-wrap gap-1 border-b border-neutral-300 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-900">
        {buttons.map((button, index) => {
          const previous = buttons[index - 1];
          const showDivider = previous && previous.group !== button.group;
          const disabled = button.isDisabled?.() ?? false;

          return (
            <Fragment key={button.label}>
              {showDivider ? (
                <span
                  aria-hidden
                  className="mx-1 my-1 h-6 w-px bg-neutral-300 dark:bg-neutral-700"
                />
              ) : null}
              <button
                type="button"
                title={button.title}
                onClick={button.run}
                aria-pressed={button.isActive()}
                disabled={disabled}
                className={clsx(
                  "cursor-pointer rounded-sm border px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  button.isActive()
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  button.group === "table-destroy" &&
                    !button.isActive() &&
                    "hover:border-red-400 hover:text-red-700 dark:hover:border-red-700 dark:hover:text-red-300",
                )}
              >
                {button.label}
              </button>
            </Fragment>
          );
        })}
      </div>

      <div className="admin-editor-scroll">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
