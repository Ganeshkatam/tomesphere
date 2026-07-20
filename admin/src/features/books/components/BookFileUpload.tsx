"use client";

import { useState } from "react";
import { uploadBookFileAction } from "../file-actions";

export function BookFileUpload({ bookId }: { bookId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage (mocked for now since we don't have the bucket initialized in this context,
      // but in reality we'd use supabase.storage.from('books').upload(...))
      const format = file.name.split(".").pop() || "unknown";
      const storagePath = `${bookId}/${crypto.randomUUID()}.${format}`;
      const mimeType = file.type || "application/octet-stream";
      const size = file.size;

      // Mock storage upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // const { data, error } = await supabase.storage.from('books').upload(storagePath, file);
      // if (error) throw error;

      // 2. Save metadata to book_files
      const formData = new FormData();
      formData.append("bookId", bookId);
      formData.append("format", format);
      formData.append("storagePath", storagePath);
      formData.append("mimeType", mimeType);
      formData.append("size", size.toString());
      formData.append("isPrimary", "true");

      await uploadBookFileAction(formData);
    } catch (err: any) {
      console.error("Upload failed", err);
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h3 className="font-medium text-slate-800 mb-2">Upload Book File</h3>
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isUploading && (
          <span className="text-sm text-blue-600">Uploading...</span>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
