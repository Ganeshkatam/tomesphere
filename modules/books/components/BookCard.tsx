"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, BookOpen, Clock, Check, Star, Loader2, FolderPlus } from "lucide-react";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";
import DefaultBookCover from "./DefaultBookCover";
import { changeReadingStateAction } from "@/modules/library/presentation/actions/library";
import { getBookShelvesAction, toggleBookInShelfAction } from "@/app/(workspace)/me/shelves/actions";
import { CollectionDto } from "@/modules/library/application/dto/response/CollectionDto";
import { showSuccess, showError } from "@/lib/toast";

export interface BookCardModel {
  readonly id: string;
  readonly slug?: string;
  readonly title: string;
  readonly authors: readonly { readonly name: string }[];
  readonly genres?: readonly { readonly name: string }[];
  readonly coverUrl: string | null;
  readonly language?: string | null;
  readonly publishedDate?: string | null;
  readonly publicationYear?: number | null;
  readonly isFeatured?: boolean;
  readonly progress?: number;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly status?:
    | "want_to_read"
    | "currently_reading"
    | "finished"
    | "reading"
    | "abandoned"
    | "none";
}

interface BookCardProps {
  book: BookCardModel;
  onAddToList?: (
    status: "want_to_read" | "currently_reading" | "finished",
  ) => void;
  priority?: boolean;
}

export default function BookCard({
  book,
  onAddToList,
  priority = false,
}: BookCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"shelves" | "status">("shelves");
  const [shelves, setShelves] = useState<CollectionDto[]>([]);
  const [containingShelfIds, setContainingShelfIds] = useState<string[]>([]);
  const [isLoadingShelves, setIsLoadingShelves] = useState(false);

  const authorNames = useMemo(() => {
    if (!book.authors || book.authors.length === 0) return "TomeSphere Library";
    const names = book.authors
      .map((a: any) => (typeof a === "string" ? a : a?.name))
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "TomeSphere Library";
  }, [book.authors]);

  const year =
    book.publicationYear ||
    (book.publishedDate
      ? new Date(book.publishedDate).getFullYear()
      : "Archive");

  const genreName = useMemo(() => {
    const firstGenre = book.genres?.[0];
    if (!firstGenre) return "Literature";
    const name =
      typeof firstGenre === "string" ? firstGenre : (firstGenre as any)?.name;
    return name || "Literature";
  }, [book.genres]);

  const handleCardClick = () => {
    router.push(`/book/${book.slug || book.id}`);
  };

  const handleOpenMenu = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(true);
    setIsLoadingShelves(true);
    try {
      const data = await getBookShelvesAction(book.id);
      setShelves(data.shelves);
      setContainingShelfIds(data.containingShelfIds);
    } catch (err) {
      console.error("Failed to load user shelves", err);
    } finally {
      setIsLoadingShelves(false);
    }
  };

  const handleToggleShelf = async (shelfId: string, shelfName: string) => {
    const isCurrentlyIn = containingShelfIds.includes(shelfId);
    const nextContaining = isCurrentlyIn
      ? containingShelfIds.filter((id) => id !== shelfId)
      : [...containingShelfIds, shelfId];

    setContainingShelfIds(nextContaining);
    try {
      await toggleBookInShelfAction(shelfId, book.id, !isCurrentlyIn);
      showSuccess(
        !isCurrentlyIn
          ? `Added to "${shelfName}"`
          : `Removed from "${shelfName}"`,
      );
    } catch (err: any) {
      setContainingShelfIds(containingShelfIds); // revert on failure
      showError(err.message || "Failed to update shelf");
    }
  };

  const handleStatusSelect = async (
    status: "want_to_read" | "currently_reading" | "finished",
  ) => {
    setShowMenu(false);
    if (onAddToList) {
      onAddToList(status);
      return;
    }

    try {
      const res = await changeReadingStateAction(book.id, status);
      if (res.success) {
        showSuccess(
          status === "want_to_read"
            ? "Added to Want to Read"
            : status === "currently_reading"
              ? "Moved to Currently Reading"
              : "Marked as Finished",
        );
        router.refresh();
      } else {
        showError(res.error.message || "Failed to update status");
      }
    } catch (err: any) {
      showError(err.message || "Failed to update status");
    }
  };

  return (
    <div className="relative w-full flex flex-col group select-none">
      {/* Book Card Shell */}
      <div
        onClick={handleCardClick}
        className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col transition-all duration-300 [transform:translateZ(0)]"
      >
        {/* Cover Aspect [2/3] with Quick Hover Action Overlay */}
        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-950">
          {!imageLoaded && book.coverUrl && !hasError && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-0" />
          )}

          {book.coverUrl && !hasError ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 240px"
              priority={priority}
              unoptimized={true}
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true);
                setHasError(true);
              }}
            />
          ) : (
            <DefaultBookCover
              title={book.title}
              authors={authorNames}
              genre={genreName}
            />
          )}

          {/* Subtle Book Spine Depth Shadow on Left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/25 via-white/15 to-transparent pointer-events-none z-10" />

          {/* Featured Badge */}
          {book.isFeatured && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 py-0.5 rounded-md text-[9px] font-black shadow-md flex items-center gap-0.5 z-10">
              <Star size={9} fill="currentColor" />
              <span>Featured</span>
            </div>
          )}

          {/* Hover Overlay with Read & Shelf Buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2.5 z-10">
            <Link
              href={`/read/${book.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 dark:bg-white dark:text-slate-950 hover:bg-indigo-50 font-extrabold text-xs shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <Play size={11} className="fill-slate-950" />
              <span>
                {book.status === "reading" ||
                book.status === "currently_reading"
                  ? "Resume"
                  : book.status === "finished"
                    ? "Re-read"
                    : "Read"}
              </span>
            </Link>

            {/* Add to Shelf Button */}
            <button
              type="button"
              onClick={handleOpenMenu}
              className="w-7 h-7 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-95"
              title="Add to Shelf"
            >
              <FolderPlus size={13} />
            </button>
          </div>

          {/* Clean In-Card Shelves & Status Selector Overlay */}
          {showMenu && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
              className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xs flex flex-col justify-between p-2 animate-in fade-in duration-150 text-xs"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 flex flex-col h-full overflow-hidden"
              >
                {/* Header with Tab Switcher & Close */}
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("shelves")}
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        activeTab === "shelves"
                          ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Shelves
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("status")}
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        activeTab === "status"
                          ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Status
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 text-xs leading-none"
                  >
                    ✕
                  </button>
                </div>

                {/* Content: Custom Shelves Tab */}
                {activeTab === "shelves" ? (
                  <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
                    {isLoadingShelves ? (
                      <div className="flex items-center justify-center py-8 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      </div>
                    ) : shelves.length === 0 ? (
                      <div className="text-center py-6 px-1">
                        <p className="text-[11px] text-slate-400 mb-2">No custom shelves yet</p>
                        <Link
                          href="/me/shelves"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <FolderPlus size={11} />
                          <span>Create Shelf</span>
                        </Link>
                      </div>
                    ) : (
                      shelves.map((shelf) => {
                        const isInShelf = containingShelfIds.includes(shelf.id);
                        return (
                          <button
                            key={shelf.id}
                            type="button"
                            onClick={() => handleToggleShelf(shelf.id, shelf.name)}
                            className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                              isInShelf
                                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="truncate pr-1">{shelf.name}</span>
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                                isInShelf
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {isInShelf && <Check size={9} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                ) : (
                  /* Reading Status Tab */
                  <div className="flex-1 space-y-1 py-1">
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("want_to_read")}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                        book.status === "want_to_read"
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <BookOpen size={12} className="text-amber-500 shrink-0" />
                      <span className="truncate">Want to Read</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("currently_reading")}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                        book.status === "reading" || book.status === "currently_reading"
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Clock size={12} className="text-indigo-500 shrink-0" />
                      <span className="truncate">Currently Reading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("finished")}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                        book.status === "finished"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Check size={12} className="text-emerald-500 shrink-0" />
                      <span className="truncate">Finished</span>
                    </button>
                  </div>
                )}

                {/* Footer Link */}
                <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <Link
                    href="/me/shelves"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                  >
                    Manage Shelves →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Details Section Below Cover */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 min-h-[2.25rem] leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {book.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1 font-medium">
              by {authorNames}
            </p>
          </div>

          <div className="mt-2.5 space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            {/* Reading Progress Indicator if present */}
            {typeof book.progress === "number" && book.progress > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>
                    {book.status === "finished"
                      ? "Finished"
                      : book.currentPage && book.totalPages
                        ? `p. ${book.currentPage}/${book.totalPages}`
                        : `${book.progress}%`}
                  </span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      book.status === "finished"
                        ? "bg-emerald-500"
                        : "bg-indigo-600"
                    }`}
                    style={{ width: `${Math.max(4, book.progress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Genre & Year Chip */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <span className="truncate max-w-[90px]">{genreName}</span>
              <span className="shrink-0">{year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
