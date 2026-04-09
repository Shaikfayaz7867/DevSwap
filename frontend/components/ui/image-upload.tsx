'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { uploadImage } from '@/services/upload-service';
import { useAuthStore } from '@/store/auth-store';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUpload({ value = [], onChange, max = 4 }: ImageUploadProps) {
  const token = useAuthStore((s) => s.token);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!token) return;
    setUploading(true);
    try {
      const url = await uploadImage(token, file);
      onChange([...value, url]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border/70">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onChange(value.filter((u) => u !== url))}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-border/70 bg-muted/60 transition hover:bg-muted/80">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Upload className="h-5 w-5 text-foreground/60" />
          </label>
        )}
      </div>
      {uploading && <p className="text-xs text-foreground/55">Uploading...</p>}
    </div>
  );
}
