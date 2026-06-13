"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  shape?: "circle" | "square";
  className?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  shape = "square",
  className,
  label = "Upload",
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const toast = useToast();

  async function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast("Please use a JPG, PNG or WEBP image", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast("Image must be under 3MB", "error");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url as string);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  const rounded = shape === "circle" ? "rounded-full" : "rounded-card";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "relative flex items-center justify-center overflow-hidden border-2 border-dashed border-line bg-background text-muted transition-colors hover:border-brand hover:text-brand",
          rounded,
          shape === "circle" ? "h-[100px] w-[100px]" : "aspect-square w-full"
        )}
      >
        {value ? (
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            sizes="200px"
            className="object-cover"
          />
        ) : uploading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">{label}</span>
          </div>
        )}
        {value && uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
