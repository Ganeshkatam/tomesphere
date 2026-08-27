"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import { MoreVertical, Trash2, Edit2, Globe, Lock, BookMarked } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
    <Card className="group relative overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-black/50 border-border bg-card">
      
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
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
          <div className="flex items-center text-muted-foreground" title={shelf.isPublic ? "Public" : "Private"}>
            {shelf.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
        </div>

        {shelf.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {shelf.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {shelf.bookCount} {shelf.bookCount === 1 ? "book" : "books"}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Actions for ${shelf.name}`}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(shelf);
                }}
                className="cursor-pointer gap-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Shelf</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(shelf);
                }}
                className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Shelf</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
