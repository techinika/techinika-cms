// components/ui/ImageUploadModal.tsx
"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { uploadImage } from "@/supabase/CRUD/INSERT";

type ImageUploadModalProps = {
  onClose: () => void;
  onConfirm: (url: string) => void;
};

export default function ImageUploadModal({
  onClose,
  onConfirm,
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const { success, data, error } = await uploadImage(file);

    if (success) {
      onConfirm(data as string);
    } else {
      console.error(error);
      alert("Failed to upload image. Please try again.");
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="rounded-2xl w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 w-auto object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-500">
                    Click to select an image
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={onClose} className="rounded-2xl">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="rounded-2xl"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Upload and Insert"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
