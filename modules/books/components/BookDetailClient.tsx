"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { ArrowLeft, BookOpen, Heart, Download } from "lucide-react";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";
import { showError, showSuccess } from "@/lib/toast";

interface BookDetailClientProps {
  user: any;
  book: BookDetailDto;
}

export default function BookDetailClient({
  user,
  book,
}: BookDetailClientProps) {
  const router = useRouter();


  const [activeTab, setActiveTab] = useState<"overview" | "quotes">("overview");

  return (
    <div className="min-h-screen bg-gradient-page">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back</span>
        </button>
        {/* Book Header */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12 animate-fadeIn">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="card-elevated rounded-2xl overflow-hidden aspect-[2/3] bg-gradient-to-br from-primary/20 to-secondary/20">
              {book.coverUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    unoptimized={true}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 p-8">
                  <Image
                    src="/book-placeholder.svg"
                    alt="Book Placeholder"
                    width={200}
                    height={200}
                    className="opacity-70"
                  />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => router.push(`/read/${book.id}`)}
                  className="flex-1 btn btn-primary py-3 rounded-lg flex items-center justify-center gap-2 font-bold min-w-[140px]"
                >
                  <BookOpen size={20} />
                  Read
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/v1/discovery/books/${book.id}/download`);
                      if (!res.ok) throw new Error("Failed to get download link");
                      const { data } = await res.json();

                      const downloadUrl = data.formats.find((f: any) => f.format === 'pdf')?.url || data.formats[0]?.url;
                      if (!downloadUrl) throw new Error("No download format available");

                      // Trigger download
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.target = '_blank';
                      link.download = `${book.title}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showSuccess('Download started!');
                    } catch (error) {
                      showError('Download not available');
                    }
                  }}
                  disabled={!book.pdfUrl && !book.epubUrl}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold min-w-[140px] ${(book.pdfUrl || book.epubUrl)
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                    } transition-all`}
                  title={!(book.pdfUrl || book.epubUrl) ? "Download not available" : "Download book"}
                >
                  <Download size={20} />
                  Download
                </button>

                <button className="p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
                  <Heart size={24} fill="none" />
                </button>
              </div>
              <button className="btn btn-ghost w-full">
                ➕ Add to Collection
              </button>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-display font-bold mb-3">
                {book.title}
              </h1>
              <p className="text-2xl text-slate-400 mb-4">
                by {book.authors?.map(a => a.name).join(", ") || "Unknown"}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="glass px-4 py-2 rounded-full text-sm">
                  {book.genres?.[0]?.name || "Uncategorized"}
                </span>
                {book.pageCount && (
                  <span className="glass px-4 py-2 rounded-full text-sm">
                    {book.pageCount} pages
                  </span>
                )}
                {book.publishedDate && (
                  <span className="glass px-4 py-2 rounded-full text-sm">
                    {new Date(book.publishedDate).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            {/* Description — inside right column */}
            <div>
              <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">
                Description
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {book.description ||
                  generateSimpleDescription(book.title, book.authors?.map(a => a.name).join(", ") || "Unknown")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
