"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingOverlay({ isOpen, message = "Processing..." }: LoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-white font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
}
