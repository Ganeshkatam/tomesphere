"use client";

export interface BookCardModel {
  readonly id: string;
  readonly slug?: string;
  readonly title: string;
  readonly authors: readonly { readonly name: string; }[];
  readonly genres?: readonly { readonly name: string; }[];
  readonly coverUrl: string | null;
  readonly language?: string | null;
  readonly publishedDate?: string | null; // Used by legacy BookDto
  readonly publicationYear?: number | null; // Used by BookSummaryDto
  readonly isFeatured?: boolean;
}
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Heart, Star, Plus, BookOpen, Clock, Check } from "lucide-react";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";

interface BookCardProps {
  book: BookCardModel;
  onAddToList?: (
    status: "want_to_read" | "currently_reading" | "finished",
  ) => void;
}

export default function BookCard({ book, onAddToList }: BookCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Auto-generate description if missing (using title and author since description is not in BookDto)
  const displayDescription = useMemo(() => {
    const authorNames =
      book.authors?.map((a) => a.name).join(", ") || "Unknown Author";
    return generateSimpleDescription(book.title, authorNames);
  }, [book.title, book.authors]);

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <div
      className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] transition-all duration-500 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
      style={{
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
    >
      {/* Cover Image with Loading State */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {!imageLoaded && book.coverUrl && !hasError && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse"
            style={{ animation: "shimmer 2s ease-in-out infinite" }}
          />
        )}
        {book.coverUrl && !hasError ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            unoptimized={true}
            className={`object-cover transition-all duration-750 z-10 group-hover:scale-[1.03] group-hover:brightness-105 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              setHasError(true);
            }}
          />
        ) : null}

        {/* Default Book Cover - Always rendered in the background as a perfect placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0">
          {/* Book Icon */}
          <div className="mb-4 w-16 h-16 relative opacity-50">
            <Image
              src="/book-placeholder.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          {/* Book Title on Cover */}
          <div className="text-center space-y-2">
            <h4 className="text-white/90 font-display font-bold text-sm leading-tight line-clamp-3">
              {book.title}
            </h4>
            <p className="text-white/60 text-xs font-medium line-clamp-2">
              {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
          <p className="text-white text-sm line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {displayDescription}
          </p>
        </div>

        {/* Featured Badge */}
        {book.isFeatured && (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 z-20">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-white line-clamp-1 mb-0.5 group-hover:text-primary-light transition-colors leading-tight">
            {book.title}
          </h3>
          <p className="text-[13px] text-slate-500 mb-1 font-medium truncate">
            by {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
          </p>

          <p className="text-[12px] text-slate-400 font-medium truncate">
            {book.genres?.[0]?.name || "Uncategorized"}
            {book.language ? ` • ${book.language}` : ""} •{" "}
            {book.publicationYear || (book.publishedDate
              ? new Date(book.publishedDate).getFullYear()
              : "2025")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          {/* Primary action "Read →" */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/book/${book.id}`);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.05]"
          >
            <span>Read</span>
            <span className="text-[10px]">→</span>
          </button>



          {/* Add to List */}
          {onAddToList && (
            <div className="relative ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                onBlur={() => setTimeout(() => setShowMenu(false), 200)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary-light text-slate-400 transition-all transform hover:scale-110"
                title="Add to reading list"
              >
                <Plus size={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList("want_to_read");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                  >
                    <BookOpen size={16} />
                    <span>Want to Read</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList("currently_reading");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                  >
                    <Clock size={16} />
                    <span>Currently Reading</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList("finished");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                  >
                    <Check size={16} />
                    <span>Finished</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
