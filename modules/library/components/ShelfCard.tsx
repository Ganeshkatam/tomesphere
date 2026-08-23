"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import { Settings, Trash2, Edit2, Globe, Lock, BookMarked } from "lucide-react";

interface ShelfCardProps {
  shelf: ShelfSummaryDto;
  onEdit: (shelf: ShelfSummaryDto) => void;
  onDelete: (shelf: ShelfSummaryDto) => void;
}

export default function ShelfCard({ shelf, onEdit, onDelete }: ShelfCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/me/shelves/${shelf.id}`);
  };

  // Prepare mosaic covers (up to 4)
  const covers = (shelf.previewBooks || []).slice(0, 4);
  const placeholdersNeeded = Math.max(0, 4 - covers.length);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col hover:-translate-y-1">
      
      {/* Cover Visual Area */}
      <div 
        className="aspect-[4/3] w-full cursor-pointer overflow-hidden relative bg-slate-950"
        onClick={handleNavigate}
      >
        {shelf.coverImage ? (
          /* Custom Shelf Cover Artwork */
          <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
            <Image
              src={shelf.coverImage}
              alt={shelf.name}
              fill
              className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Ambient Lighting & Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/30" />
            <div className="relative z-10 flex flex-col items-center gap-1.5 p-4 text-center">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.25em] text-amber-300 drop-shadow-md">
                Curated Shelf
              </span>
              <span className="text-xs font-serif font-bold text-white line-clamp-1 max-w-[200px] drop-shadow-lg">
                {shelf.name}
              </span>
            </div>
          </div>
        ) : covers.length === 0 ? (
          /* Premium Default Shelf Artwork */
          <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
            <Image
              src="/hero_sanctuary_bg.jpg"
              alt={shelf.name}
              fill
              className="object-cover opacity-35 scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Ambient Lighting & Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/60" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Central Badge */}
            <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-950/60 group-hover:scale-110 group-hover:border-indigo-400/50 transition-all duration-300">
                <BookMarked className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.25em] text-indigo-300/90 drop-shadow-sm">
                Curated Shelf
              </span>
              <span className="text-xs font-serif font-bold text-slate-100 line-clamp-1 max-w-[200px] drop-shadow-md">
                {shelf.name}
              </span>
            </div>
          </div>
        ) : (
          /* 2x2 Mosaic for shelves with books */
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-slate-800">
            {covers.map((book) => (
              <div key={book.bookId} className="relative w-full h-full bg-slate-900 overflow-hidden">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 text-center">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{book.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            ))}
            {Array.from({ length: placeholdersNeeded }).map((_, i) => (
              <div key={`placeholder-${i}`} className="relative w-full h-full bg-slate-900/60 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-800/80 border border-slate-700/50" />
              </div>
            ))}
          </div>
        )}
        
        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-bold text-lg leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-1"
            onClick={handleNavigate}
            title={shelf.name}
          >
            {shelf.name}
          </h3>
          <div className="flex items-center text-slate-500" title={shelf.isPublic ? "Public" : "Private"}>
            {shelf.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
        </div>

        {shelf.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
            {shelf.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-default)]">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {shelf.bookCount} {shelf.bookCount === 1 ? "book" : "books"}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(shelf); }}
              className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
              title="Edit Shelf"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(shelf); }}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors"
              title="Delete Shelf"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
