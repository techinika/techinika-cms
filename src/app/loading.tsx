// components/ui/LoadingSpinner.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-primary">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-xl font-semibold">Loading data...</p>
      <p className="mt-1 text-sm">Please wait a moment.</p>
    </div>
  );
}
