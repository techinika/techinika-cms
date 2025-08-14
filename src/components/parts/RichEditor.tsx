// components/ui/CustomRichTextEditor.tsx
"use client";

// Extend the Window interface to include twttr with widgets property
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: Element | null) => void;
      };
    };
  }
}

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Image,
  Video,
} from "lucide-react";
import VideoEmbedModal from "./VideoEmbedModal";
import ImageUploadModal from "./UploadImageModal";

type CustomRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

// A simple function to apply formatting using document.execCommand
const applyFormat = (
  command: string,
  value: string | undefined = undefined
) => {
  document.execCommand(command, false, value);
};

export default function CustomRichTextEditor({
  value,
  onChange,
}: CustomRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [twitterScriptLoaded, setTwitterScriptLoaded] = useState(false);

  // Sync the external value with the editor's content when it changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle input to keep the parent state in sync
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Generic handler for formatBlock commands
  const handleFormatBlock = (tag: string) => {
    applyFormat("formatBlock", tag);
    handleInput();
  };

  // Handler for hyperlinks
  const handleLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      applyFormat("createLink", url);
      handleInput();
    }
  };

  // Handler for inserting HTML content, used by the modals
  const handleInsertHtml = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      // Create a new div to act as a block-level wrapper for the inserted content
      const wrapperDiv = document.createElement("div");
      wrapperDiv.innerHTML = html;
      wrapperDiv.style.margin = "16px 0"; // Add some vertical margin for spacing

      // Insert the new div element at the current cursor position
      range.insertNode(wrapperDiv);

      // Move the cursor after the inserted content
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      handleInput();
    }
  };

  // Handler for automatic Twitter (X) link embedding
  const handlePaste = (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData("text/plain");
    const twitterRegex =
      /https:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/(\d+)/;
    const match = pastedText.match(twitterRegex);

    if (match) {
      // Prevent the default paste action
      event.preventDefault();

      // Check if the Twitter widgets script is already loaded, and if not, load it
      if (!twitterScriptLoaded) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        script.onload = () => {
          setTwitterScriptLoaded(true);
          // If the script is loaded, render the tweet
          if (window.twttr) {
            window.twttr.widgets.load(editorRef.current);
          }
        };
        document.head.appendChild(script);
      }

      const tweetId = match[1];
      const twitterEmbedHtml = `<blockquote class="twitter-tweet"><a href="${pastedText}">A tweet from Twitter/X</a></blockquote>`;

      handleInsertHtml(twitterEmbedHtml);
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-2xl border bg-white p-4">
        <div className="flex flex-wrap items-center space-x-1 pb-2 mb-2 border-b border-slate-200">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("bold");
              handleInput();
            }}
            className="h-8 w-8 rounded-full"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("italic");
              handleInput();
            }}
            className="h-8 w-8 rounded-full"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("underline");
              handleInput();
            }}
            className="h-8 w-8 rounded-full"
          >
            <Underline className="h-4 w-4" />
          </Button>

          {/* Block Formatting */}
          <span className="h-6 w-px bg-slate-200 mx-2"></span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatBlock("h1");
            }}
            className="h-8 w-8 rounded-full"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatBlock("h2");
            }}
            className="h-8 w-8 rounded-full"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatBlock("blockquote");
            }}
            className="h-8 w-8 rounded-full"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatBlock("code");
            }}
            className="h-8 w-8 rounded-full"
          >
            <Code className="h-4 w-4" />
          </Button>

          {/* Lists */}
          <span className="h-6 w-px bg-slate-200 mx-2"></span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("insertUnorderedList");
              handleInput();
            }}
            className="h-8 w-8 rounded-full"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat("insertOrderedList");
              handleInput();
            }}
            className="h-8 w-8 rounded-full"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          {/* Media */}
          <span className="h-6 w-px bg-slate-200 mx-2"></span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleLink();
            }}
            className="h-8 w-8 rounded-full"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowImageModal(true);
            }}
            className="h-8 w-8 rounded-full"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowVideoModal(true);
            }}
            className="h-8 w-8 rounded-full"
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="min-h-[300px] outline-none p-2"
          style={{ caretColor: "black" }}
        ></div>
      </div>

      {showImageModal && (
        <ImageUploadModal
          onClose={() => setShowImageModal(false)}
          onConfirm={(url) => {
            handleInsertHtml(
              `<figure><img src="${url}" alt="User uploaded image" style="max-width:100%;"><figcaption style="text-align:center;font-style:italic;margin-top:8px;">Image Caption</figcaption></figure>`
            );
            setShowImageModal(false);
          }}
        />
      )}

      {showVideoModal && (
        <VideoEmbedModal
          onClose={() => setShowVideoModal(false)}
          onConfirm={(html) => {
            handleInsertHtml(html);
            setShowVideoModal(false);
          }}
        />
      )}
    </>
  );
}
