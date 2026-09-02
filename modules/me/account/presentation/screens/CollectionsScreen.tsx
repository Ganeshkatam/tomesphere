"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Library } from "lucide-react";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";

interface CollectionsScreenProps {
  recentBooks: Partial<BookDto>[];
}

export default function CollectionsScreen({
  recentBooks,
}: CollectionsScreenProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Collections</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your curated shelves and book collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookOpen size={20} className="fill-blue-500/20" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {recentBooks.length} recently read
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {recentBooks.slice(0, 3).map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  <div className="relative w-8 h-10 shrink-0">
                    <Image
                      src={
                        book.coverUrl ||
                        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"
                      }
                      alt={book.title || "Book Cover"}
                      fill
                      className="object-cover rounded shadow-xs"
                      sizes="32px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {book.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                      {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/me/reading?status=finished"
            className="mt-6 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors text-right"
          >
            View all books →
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 border-dashed shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3 shadow-xs">
            <Library size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Create Custom Shelf
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-1 font-medium">
            Group books by topic, course curriculum, or reading clubs.
          </p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm uppercase tracking-wider cursor-pointer">
            New Shelf
          </button>
        </div>
      </div>
    </div>
  );
}
