// components/ui/VideoEmbedModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Video as VideoIcon } from "lucide-react";

type VideoEmbedModalProps = {
  onClose: () => void;
  onConfirm: (html: string) => void;
};

export default function VideoEmbedModal({
  onClose,
  onConfirm,
}: VideoEmbedModalProps) {
  const [url, setUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [caption, setCaption] = useState("");

  const handlePreview = () => {
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    let html = "";

    if (isYouTube) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split(".be/")[1];
      if (videoId) {
        html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`;
      }
    } else {
      html = `<video src="${url}" controls style="max-width:100%;"></video>`;
    }
    setPreviewHtml(html);
  };

  const handleConfirm = () => {
    let finalHtml = previewHtml;
    if (caption) {
      finalHtml = `<figure>${previewHtml}<figcaption style="text-align:center;font-style:italic;margin-top:8px;">${caption}</figcaption></figure>`;
    }
    if (finalHtml) {
      onConfirm(finalHtml);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="rounded-2xl w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Embed Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="video-url"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Video URL (e.g., YouTube)
              </label>
              <Input
                id="video-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label
                htmlFor="video-caption"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Caption (optional)
              </label>
              <Input
                id="video-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Video caption"
              />
            </div>

            <Button
              onClick={handlePreview}
              disabled={!url}
              className="w-full rounded-2xl flex items-center gap-2"
            >
              <Eye className="h-4 w-4" /> Preview
            </Button>

            {previewHtml && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={onClose} className="rounded-2xl">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!previewHtml}
              className="rounded-2xl"
            >
              Embed Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
