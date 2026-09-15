"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";

type ToolbarButton = {
  label: string;
  isActive: () => boolean;
  run: () => void;
};

const editorClasses =
  "prose prose-sm max-w-none min-h-[240px] px-3 py-3 text-sm leading-relaxed focus:outline-none prose-headings:font-semibold prose-p:my-2";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Required under SSR: rendering immediately causes a hydration mismatch
    // because TipTap builds its document from the browser DOM.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: editorClasses },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[288px] animate-pulse rounded-sm border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900" />
    );
  }

  const buttons: ToolbarButton[] = [
    {
      label: "B",
      isActive: () => editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      isActive: () => editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "S",
      isActive: () => editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "H2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "• List",
      isActive: () => editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1. List",
      isActive: () => editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      isActive: () => editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-300 dark:border-neutral-700">
      <div className="flex flex-wrap gap-1 border-b border-neutral-300 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-900">
        {buttons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.run}
            aria-pressed={button.isActive()}
            className={clsx(
              "cursor-pointer rounded-sm border px-2.5 py-1 text-xs font-semibold transition-colors",
              button.isActive()
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800",
            )}
          >
            {button.label}
          </button>
        ))}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
