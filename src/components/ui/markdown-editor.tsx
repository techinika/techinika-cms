"use client";

import { useRef } from "react";
import { Bold, Italic, Heading1, List, Link as LinkIcon } from "lucide-react";

type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
};

export const MarkdownEditor = ({
  name,
  value,
  onChange,
  label,
  required = false,
  rows = 12,
  placeholder = "",
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormat = (style: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    let insert = "";

    switch (style) {
      case "bold":
        insert = `**${selected || "Bold Text"}**`;
        break;
      case "italic":
        insert = `*${selected || "Italic Text"}*`;
        break;
      case "heading":
        insert = `\n# ${selected || "Heading"}\n`;
        break;
      case "bullet":
        insert = `\n- ${selected || "List Item"}`;
        break;
      case "link":
        insert = `[${selected || "Link Text"}](https://example.com)`;
        break;
    }

    const newValue = value.slice(0, start) + insert + value.slice(end);

    const syntheticEvent = {
      target: { name, value: newValue },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(syntheticEvent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + insert.length;
    }, 0);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Toolbar */}
      <div className="flex space-x-2 p-2 border border-gray-300 border-b-0 bg-gray-100 rounded-t">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="p-2 hover:bg-white border rounded"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="p-2 hover:bg-white border rounded"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("heading")}
          className="p-2 hover:bg-white border rounded"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("bullet")}
          className="p-2 hover:bg-white border rounded"
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("link")}
          className="p-2 hover:bg-white border rounded"
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-b focus:ring-primary focus:border-primary"
      />
    </div>
  );
};
