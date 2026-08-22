"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import { Settings, Trash2, Edit2, Globe, Lock } from "lucide-react";

interface ShelfCardProps {
  shelf: ShelfSummaryDto;
  onEdit: (shelf: ShelfSummaryDto) => void;
  onDelete: (shelf: ShelfSummaryDto) => void;
}

export default function ShelfCard({ shelf, onEdit, onDelete }: ShelfCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/me/library?shelf=${shelf.id}`);
  };

  // Prepare mosaic covers (up to 4)
  const covers = shelf.previewBooks.slice(0, 4);
  const placeholdersNeeded = Math.max(0, 4 - covers.length);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      
      {/* 2x2 Mosaic */}
      <div 
        className="aspect-[4/3] grid grid-cols-2 grid-rows-2 gap-[1px] bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden relative"
        onClick={handleNavigate}
      >
        {covers.map((book, i) => (
          <div key={book.bookId} className="relative w-full h-full bg-slate-200 dark:bg-slate-700">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-400">
                <span className="text-xs font-semibold">{book.title.charAt(0)}</span>
              </div>
            )}
          </div>
        ))}
        {Array.from({ length: placeholdersNeeded }).map((_, i) => (
          <div key={`placeholder-${i}`} className="relative w-full h-full bg-slate-100 dark:bg-slate-800/50" />
        ))}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
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
