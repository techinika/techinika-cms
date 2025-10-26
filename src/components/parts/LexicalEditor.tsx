"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LexicalComposer,
  RichTextPlugin,
  ContentEditable,
  OnChangePlugin,
  HistoryPlugin,
  AutoFocusPlugin,
  PlainTextPlugin,
} from "@lexical/react";
import { $getRoot, $getSelection, EditorState, LexicalEditor } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { HistoryState } from "@lexical/history";
import { convertToHtml } from "@lexical/html";
import { Bold, Code, Image, Italic, Link, List, Quote, Redo, Undo, Youtube } from "lucide-react";

/**
 * Editor initial config
 */
const initialConfig = {
  namespace: "TechinikaEditor",
  theme: {
    // You can extend Lexical theme here (classes for nodes)
    paragraph: "text-gray-800 leading-7 mb-4",
    quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4",
    heading: "font-bold",
    // add more classes as needed
  },
  // nodes to register — include nodes you want to use
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    LinkNode,
    ImageNode,
    TableNode,
    TableRowNode,
    TableCellNode,
  ],
  // onError handler
  onError(err: Error) {
    console.error("Lexical error:", err);
  },
};

/**
 * A small toolbar component (you can style it to match your design)
 */
function Toolbar({ editor }: { editor: LexicalEditor | null }) {
  const execCommand = useCallback(
    (cmd: string, payload?: any) => {
      if (!editor) return;
      switch (cmd) {
        case "bold":
          editor.dispatchCommand("formatBold", undefined);
          break;
        case "italic":
          editor.dispatchCommand("formatItalic", undefined);
          break;
        case "heading":
          editor.update(() => {
            // convert current selection to heading level 2
            const selection = $getSelection();
            if (selection && selection.hasFormat) {
              // fallback: toggle block type using native API
            }
          });
          // simpler: instruct user to use the dropdown or implement custom command
          break;
        case "ol":
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;
        case "ul":
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;
        case "link": {
          const url = prompt("Enter URL");
          if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          }
          break;
        }
        case "image": {
          // open file input programmatically
          const input = document.getElementById(
            "lexical-image-input"
          ) as HTMLInputElement | null;
          if (input) input.click();
          break;
        }
        case "code":
          editor.update(() => {
            // insert code block: simplest method is insert raw code node
            const selection = $getSelection();
            if (selection) {
              const codeNode = new CodeNode();
              codeNode.append(
                selection.extractText ? selection.extractText() : null
              );
              // append node to root
              const root = $getRoot();
              root.append(codeNode);
            }
          });
          break;
        case "undo":
          editor.dispatchCommand("UNDO_COMMAND", undefined);
          break;
        case "redo":
          editor.dispatchCommand("REDO_COMMAND", undefined);
          break;
        case "blockquote":
          editor.update(() => {
            // Toggle blockquote by wrapping selection
            const selection = $getSelection();
            if (selection) {
              // Lexical has QuoteNode usage via API — we rely on default behavior from rich-text plugin
            }
          });
          break;
        case "youtube": {
          const url = prompt("Paste YouTube URL or embed code:");
          if (url) {
            // Insert simple iframe block as HTML
            editor.update(() => {
              const root = $getRoot();
              const p = root.append ? root.append() : null;
            });
            // We'll use a simpler path: raise a custom event to OnChangePlugin consumer to embed HTML
            const evt = new CustomEvent("lexical-insert-embed", {
              detail: url,
            });
            window.dispatchEvent(evt);
          }
          break;
        }
        default:
          break;
      }
    },
    [editor]
  );

  return (
    <div className="flex gap-2 items-center bg-white p-2 border rounded-md">
      <button
        className="px-2 py-1"
        onClick={() => execCommand("bold")}
        title="Bold"
      >
        <Bold />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("italic")}
        title="Italic"
      >
        <Italic />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("link")}
        title="Add link"
      >
        <Link />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("ol")}
        title="Ordered list"
      >
        <List />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("ul")}
        title="Bullet list"
      >
        <List />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("code")}
        title="Code block"
      >
        <Code />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("blockquote")}
        title="Blockquote"
      >
        <Quote />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("youtube")}
        title="Embed video"
      >
        <Youtube />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("image")}
        title="Insert image"
      >
        <Image />
      </button>
      <div className="flex-grow" />
      <button
        className="px-2 py-1"
        onClick={() => execCommand("undo")}
        title="Undo"
      >
        <Undo />
      </button>
      <button
        className="px-2 py-1"
        onClick={() => execCommand("redo")}
        title="Redo"
      >
        <Redo />
      </button>

      <input
        id="lexical-image-input"
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

export default function ArticleEditor({
  initialHtml,
  onSave,
  uploadImage,
}: {
  initialHtml?: string;
  onSave?: (html: string) => Promise<void>;
  uploadImage?: (file: File) => Promise<string>;
}) {
  const editorRef = useRef<LexicalEditor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [contentHtml, setContentHtml] = useState(initialHtml ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Convert editor content to HTML
  const exportToHtml = useCallback(async () => {
    if (!editorRef.current) return "";
    let html = "";
    await editorRef.current.update(() => {
      const editorState = editorRef.current!.getEditorState();
      // convertToHtml expects a config — we provide a simple mapping
      html = convertToHtml(editorState, {
        // tag mapping can be customized here
        // default behavior is usually fine
      });
    });
    return html;
  }, []);

  // OnChange handler: keep local HTML preview (optional)
  const onEditorChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      editorRef.current = editor;
      // update serialized HTML into local state (debounce in real app)
      editor.update(() => {
        const html = convertToHtml(editor.getEditorState(), {});
        setContentHtml(html as unknown as string);
      });
    },
    []
  );

  // Handle image uploads via file input
  useEffect(() => {
    const input = document.getElementById(
      "lexical-image-input"
    ) as HTMLInputElement | null;
    const handler = async (e: Event) => {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (!file) return;

      // If user provided an uploadImage function (e.g., uploads to Supabase), use it
      let url: string | null = null;
      try {
        if (uploadImage) {
          url = await uploadImage(file);
        } else {
          // Fallback: read file as data URL (not recommended for production)
          url = await new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result));
            fr.onerror = reject;
            fr.readAsDataURL(file);
          });
        }
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }

      // Insert image node using editor API
      if (editorRef.current && url) {
        editorRef.current.update(() => {
          const root = $getRoot();
          // ImageNode usage depends on package API — use a generic insert via HTML
          const imgHtml = `<p><img src="${url}" alt="${file.name}" /></p>`;
          // simplest: insert HTML as raw; for more control implement ImageNode API
          const selection = $getSelection();
          // directly append HTML - use clipboard insert plugin normally, but here we use DOM insertion
          const div = document.createElement("div");
          div.innerHTML = imgHtml;
          // For now append a paragraph with image to root (simple approach)
          root.append(div as unknown as any);
        });
      }

      fileInput.value = "";
    };

    input?.addEventListener("change", handler);
    return () => input?.removeEventListener("change", handler);
  }, [uploadImage]);

  // When initialHtml changes, you may want to load it into editor — Lexical supports parsing HTML via @lexical/html
  // For brevity, this example uses the RichTextPlugin default content and expects initial state to be passed via LexicalComposer initialConfig editorState
  // Setting initial content requires converting HTML -> Lexical nodes. You can use @lexical/html's convertFromHtml to provide editorState.

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorShell
          setEditorRef={(ed: LexicalEditor) => {
            editorRef.current = ed;
            setEditorReady(true);
          }}
          onChange={onEditorChange}
          contentHtml={contentHtml}
        />
      </LexicalComposer>

      <div className="mt-4 flex gap-2">
        <button
          onClick={async () => {
            if (!editorRef.current) return;
            setIsSaving(true);
            try {
              const html = await exportToHtml();
              if (onSave) await onSave(html);
              // optional: show toast
            } catch (err) {
              console.error(err);
            } finally {
              setIsSaving(false);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Article"}
        </button>

        <button
          onClick={async () => {
            const html = await exportToHtml();
            // quick debug: open in new tab
            const w = window.open();
            if (w) {
              w.document.write(html);
              w.document.close();
            }
          }}
          className="bg-gray-100 border px-4 py-2 rounded-md"
        >
          Preview
        </button>
      </div>
    </div>
  );
}

/**
 * Small inner component that contains plugins + toolbar
 */
function EditorShell({
  setEditorRef,
  onChange,
  contentHtml,
}: {
  setEditorRef: (ed: LexicalEditor) => void;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  contentHtml: string;
}) {
  return (
    <>
      <LexicalInner
        setEditorRef={setEditorRef}
        onChange={onChange}
        contentHtml={contentHtml}
      />
    </>
  );
}

function LexicalInner({
  setEditorRef,
  onChange,
  contentHtml,
}: {
  setEditorRef: (ed: LexicalEditor) => void;
  onChange: (s: EditorState, e: LexicalEditor) => void;
  contentHtml: string;
}) {
  // We use `useLexicalComposerContext` if needed; for now we rely on RichTextPlugin+ContentEditable
  // Toolbar needs the editor instance; we can access via a ref in the top-level LexicalComposer by using a callback ref pattern
  const editorRef = useRef<LexicalEditor | null>(null);
  // Lexical's React integration provides `useLexicalComposerContext`, but to avoid coupling here we'll set the ref when the editor initializes.

  // Provide a function to capture the editor (this requires useLexicalComposerContext in a child, but for brevity we do a small hack)
  // NOTE: For full typed integration, use useLexicalComposerContext and provide toolbar with that context.

  return (
    <div>
      <div className="mb-2">
        {/* toolbar needs an editor instance — if you want toolbar to receive the exact editor instance, use `useLexicalComposerContext` */}
        <Toolbar editor={editorRef.current} />
      </div>

      <div className="min-h-[300px] border rounded-md p-4">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input focus:outline-none" />
          }
          placeholder={
            <div className="text-gray-400">
              Start writing your article... (use toolbar to insert images,
              embeds, code)
            </div>
          }
        />
        <HistoryPlugin />
        {/* OnChangePlugin to update serialized HTML into parent */}
        <OnChangePlugin
          onChange={(editorState, editor) => onChange(editorState, editor)}
        />
        <AutoFocusPlugin />
      </div>
    </div>
  );
}
