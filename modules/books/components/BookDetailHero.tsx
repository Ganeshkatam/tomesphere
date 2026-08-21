"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Bookmark,
  Check,
  Share2,
  BookOpen,
  Sparkles,
  Layers,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  FileCheck2,
  Award,
  Globe,
  Tag,
  GraduationCap,
} from "lucide-react";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { BookViewerContextDto } from "@/modules/books/application/queries/GetBookViewerContext/handler";
import { AuthorBooksDto } from "@/modules/books/application/queries/GetBooksByAuthor/handler";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";
import { addBookToLibraryAction } from "@/modules/library/presentation/actions/library";
import BookCard from "@/modules/books/components/BookCard";
import DefaultBookCover from "./DefaultBookCover";

interface BookDetailHeroProps {
  book: BookDetailDto;
  viewer?: BookViewerContextDto;
  relatedBooks?: any[];
  authorWorks?: AuthorBooksDto | null;
}

export function BookDetailHero({
  book,
  viewer,
  relatedBooks = [],
  authorWorks,
}: BookDetailHeroProps) {
  const [readingStatus, setReadingStatus] = useState<
    "none" | "want_to_read" | "currently_reading" | "finished"
  >(viewer?.readingStatus || (viewer?.libraryStatus === "in_library" ? "want_to_read" : "none"));
  const [progressPercentage, setProgressPercentage] = useState(viewer?.progressPercentage || 0);
  const [currentPage, setCurrentPage] = useState(viewer?.currentPage);
  const [totalPages] = useState(viewer?.totalPages || book.pageCount || 0);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [showShelfMenu, setShowShelfMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const authorScrollRef = useRef<HTMLDivElement>(null);

  const inLibrary = readingStatus !== "none";

  const authorNames = useMemo(() => {
    if (!book.authors || book.authors.length === 0) return "TomeSphere Library";
    const names = book.authors
      .map((a: any) => (typeof a === "string" ? a : a?.name))
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "TomeSphere Library";
  }, [book.authors]);

  const year = book.publishedDate
    ? new Date(book.publishedDate).getFullYear()
    : "Historic Archive";

  const primaryGenre = useMemo(() => {
    const g = book.genres?.[0];
    if (!g) return "Literature";
    return typeof g === "string" ? g : (g as any)?.name || "Literature";
  }, [book.genres]);

  const rawDescription =
    book.description || generateSimpleDescription(book.title, authorNames);

  // Parse structured sections from description if present
  const parsedSections = useMemo(() => {
    if (!rawDescription) return { mainText: "", stages: [] };

    // Check if stages/levels exist (e.g. Basic Level:, Intermediate Level:, Advanced Level:)
    const stageMatches = rawDescription.match(
      /(Basic Level|Intermediate Level|Advanced Level|Stage \d+):\s*([^.]+\.)/gi
    );

    let mainText = rawDescription;
    const stages: { label: string; text: string }[] = [];

    if (stageMatches && stageMatches.length > 0) {
      stageMatches.forEach((m) => {
        const parts = m.split(/:\s*/);
        if (parts.length >= 2) {
          stages.push({
            label: parts[0].trim(),
            text: parts.slice(1).join(": ").trim(),
          });
        }
        mainText = mainText.replace(m, "");
      });
      mainText = mainText.replace(/Core Content/gi, "").trim();
    }

    return {
      mainText: mainText || rawDescription,
      stages,
    };
  }, [rawDescription]);

  const handleSetState = async (
    targetState: "want_to_read" | "currently_reading" | "finished" | "remove"
  ) => {
    if (isUpdatingState) return;
    setIsUpdatingState(true);
    setShowShelfMenu(false);

    try {
      if (targetState === "remove") {
        const { removeBookFromLibraryAction } = await import(
          "@/modules/library/presentation/actions/library"
        );
        await removeBookFromLibraryAction(book.id);
        setReadingStatus("none");
      } else {
        await addBookToLibraryAction(book.id, targetState);
        setReadingStatus(targetState);
        if (targetState === "finished") {
          setProgressPercentage(100);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsUpdatingState(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Read "${book.title}" on TomeSphere Digital Archive`,
          url: window.location.href,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollAuthorLeft = () => {
    if (authorScrollRef.current) {
      authorScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollAuthorRight = () => {
    if (authorScrollRef.current) {
      authorScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Compute CTA label and icon
  const ctaInfo = useMemo(() => {
    if (readingStatus === "currently_reading") {
      return {
        label: "Continue Reading",
        icon: Play,
      };
    }
    if (readingStatus === "finished") {
      return {
        label: "Read Again",
        icon: Play,
      };
    }
    return {
      label: "Start Reading",
      icon: Play,
    };
  }, [readingStatus]);

  return (
    <div className="w-full space-y-10 sm:space-y-14">

      {/* 1. Breadcrumb Navigation Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link
            href="/me/library"
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>My Library</span>
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 font-bold">{primaryGenre}</span>
          <span>/</span>
          <span className="truncate max-w-[200px] sm:max-w-xs">{book.title}</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Verified Digital Edition</span>
        </div>
      </div>

      {/* 2. Cinematic Hero Spotlight (Cover on Left, Title & Direct Actions on Right) */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl p-6 sm:p-8 lg:p-10 transition-colors">

        {/* Subtle Ambient Blurred Backdrop Glow */}
        {book.coverUrl && (
          <div className="absolute right-0 top-0 w-full sm:w-2/3 h-full opacity-10 dark:opacity-20 blur-3xl pointer-events-none overflow-hidden">
            <Image
              src={book.coverUrl}
              alt=""
              fill
              className="object-cover"
              sizes="60vw"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">

          {/* Left: 3D Hardcover Cover Showcase */}
          <div className="w-[180px] min-[400px]:w-[210px] sm:w-[240px] md:w-[260px] lg:w-[280px] shrink-0">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-slate-200 dark:border-slate-700/80 group">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 240px, 280px"
                />
              ) : (
                <DefaultBookCover
                  title={book.title}
                  authors={authorNames}
                  genre={primaryGenre}
                />
              )}
            </div>
          </div>

          {/* Right: Title, Author, Badges, Primary Action CTAs & Key Stats */}
          <div className="flex-1 min-w-0 flex flex-col justify-between space-y-6 text-left w-full">

            {/* Header Badges & Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {book.genres && book.genres.length > 0 ? (
                  book.genres.map((g: any, idx: number) => {
                    const name = typeof g === "string" ? g : g.name;
                    if (!name) return null;

                    const colorThemes = [
                      "bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
                      "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300",
                      "bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
                      "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
                      "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300",
                    ];
                    const theme = colorThemes[idx % colorThemes.length];

                    return (
                      <span
                        key={g.id || name || `genre-${idx}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs transition-colors ${theme}`}
                      >
                        {idx === 0 ? (
                          <Sparkles size={12} className="shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
                        )}
                        <span>{name}</span>
                      </span>
                    );
                  })
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={12} />
                    <span>{primaryGenre}</span>
                  </span>
                )}

                {/* Live Reading State Badge */}
                {readingStatus === "currently_reading" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm animate-in fade-in">
                    <BookOpen size={12} />
                    <span>Currently Reading ({progressPercentage}%)</span>
                  </span>
                )}
                {readingStatus === "finished" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm animate-in fade-in">
                    <Check size={12} />
                    <span>Finished</span>
                  </span>
                )}
                {readingStatus === "want_to_read" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-xs animate-in fade-in">
                    <Bookmark size={12} />
                    <span>Want to Read</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-2">
                {book.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2">
                <span>by {authorNames}</span>
              </p>
            </div>

            {/* Reading Progress Indicator (if reading) */}
            {readingStatus === "currently_reading" && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 max-w-xl space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200">
                  <span>
                    {currentPage && totalPages
                      ? `Page ${currentPage} of ${totalPages}`
                      : "Reading in Progress"}
                  </span>
                  <span>{progressPercentage}% completed</span>
                </div>
                <div className="w-full h-2.5 bg-indigo-200/60 dark:bg-indigo-900/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, progressPercentage)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Primary Action Buttons (Immediately Accessible) */}
            <div className="flex items-center gap-3 flex-wrap pt-1 relative">
              <Link
                href={`/read/${book.id}`}
                className="h-12 sm:h-13 px-8 sm:px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Play size={18} className="fill-white text-white translate-x-0.5" />
                <span>{ctaInfo.label}</span>
              </Link>

              {/* Shelf Status Dropdown Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowShelfMenu(!showShelfMenu)}
                  disabled={isUpdatingState}
                  className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                    inLibrary
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  }`}
                >
                  {isUpdatingState ? (
                    <span>Updating...</span>
                  ) : readingStatus === "want_to_read" ? (
                    <>
                      <Bookmark size={16} className="text-amber-500" />
                      <span>Want to Read</span>
                    </>
                  ) : readingStatus === "currently_reading" ? (
                    <>
                      <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Currently Reading</span>
                    </>
                  ) : readingStatus === "finished" ? (
                    <>
                      <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Finished</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} />
                      <span>Add to Library</span>
                    </>
                  )}
                </button>

                {showShelfMenu && (
                  <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-30 p-2 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Set Shelf Status
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSetState("want_to_read")}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        readingStatus === "want_to_read" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold" : ""
                      }`}
                    >
                      <span>Want to Read</span>
                      {readingStatus === "want_to_read" && <Check size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetState("currently_reading")}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        readingStatus === "currently_reading" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold" : ""
                      }`}
                    >
                      <span>Currently Reading</span>
                      {readingStatus === "currently_reading" && <Check size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetState("finished")}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        readingStatus === "finished" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold" : ""
                      }`}
                    >
                      <span>Finished</span>
                      {readingStatus === "finished" && <Check size={14} />}
                    </button>

                    {inLibrary && (
                      <>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                        <button
                          type="button"
                          onClick={() => handleSetState("remove")}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer font-bold"
                        >
                          Remove from Library
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleShare}
                className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${copied
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  }`}
                title="Share this book"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="text-slate-600 dark:text-slate-300" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-1">
                  <Calendar size={13} />
                  <span>Publication</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{year}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-1">
                  <Layers size={13} />
                  <span>Pages</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {book.pageCount ? `${book.pageCount} Pages` : "Full Archive"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-1">
                  <Clock size={13} />
                  <span>Est. Read</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {(() => {
                    if (!book.pageCount || book.pageCount <= 0) return "~4 hours";
                    const totalMinutes = Math.round(book.pageCount * 1.5);
                    if (totalMinutes < 60) return `~${totalMinutes} mins`;
                    const hours = Math.floor(totalMinutes / 60);
                    const mins = totalMinutes % 60;
                    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours} hours`;
                  })()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-1">
                  <Globe size={13} />
                  <span>Language</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">English</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Two-Column Detailed Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

        {/* Left / Main Column: About this Work & Structured Learning Stages */}
        <div className="lg:col-span-8 space-y-8">

          {/* Archival Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BookOpen size={16} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  About this Volume
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Archival overview and core historical reading context
                </p>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-base sm:text-lg">
              <p>{parsedSections.mainText}</p>
            </div>

            {/* Structured Stage Breakdown Cards if present */}
            {parsedSections.stages.length > 0 && (
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  <span>Curriculum & Learning Stages</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {parsedSections.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                    >
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                        {stage.label}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                        {stage.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subject Topics & Discovery Themes */}
          {book.subjects && book.subjects.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked size={16} className="text-indigo-500" />
                <span>Subject Topics & Categorical Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {book.subjects.map((sub: any, idx: number) => (
                  <span
                    key={sub.id || sub.name || `sub-${idx}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors"
                  >
                    {typeof sub === "string" ? sub : sub.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right / Sidebar Column: Archival Provenance & Integrity Specs */}
        <div className="lg:col-span-4 space-y-6">

          {/* Provenance & Publication Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span>Publication & Archival Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Publisher</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{book.publisher || "TomeSphere Open Library"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Release Year</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{year}</span>
              </div>
              {book.edition && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Edition</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{book.edition}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">ISBN</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{book.isbn}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Digital Format</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Unabridged High-Res PDF</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Language</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{book.language || "English"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400">Annotation Support</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Active Highlighting</span>
              </div>
            </div>
          </div>

          {/* Digital Conservation Seal */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-slate-50 to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FileCheck2 size={20} />
              <span className="font-bold text-sm">Public Domain Conservation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              This literary volume is part of the global public domain. It is preserved without paywalls or subscriptions for worldwide research, learning, and cultural exploration.
            </p>
          </div>

        </div>

      </div>

      {/* 4. More by This Author Shelf */}
      {authorWorks && authorWorks.books.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-0.5">
                <Sparkles size={13} />
                <span>Author Bibliography</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                More by {authorWorks.authorName}
              </h2>
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollAuthorLeft}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollAuthorRight}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={authorScrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {authorWorks.books.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="w-[140px] min-[400px]:w-[160px] sm:w-[190px] md:w-[210px] shrink-0 snap-start"
              >
                <BookCard
                  book={{
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    authors: item.authors || [],
                    genres: item.genres || [],
                    coverUrl: item.coverUrl,
                    publicationYear: item.publicationYear,
                    publishedDate: item.publishedDate,
                    isFeatured: item.isFeatured,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Related Works Shelf */}
      {relatedBooks && relatedBooks.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                <Sparkles size={13} />
                <span>Literary Horizons</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                More in {primaryGenre} & Digital Archives
              </h2>
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {relatedBooks.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="w-[140px] min-[400px]:w-[160px] sm:w-[190px] md:w-[210px] shrink-0 snap-start"
              >
                <BookCard
                  book={{
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    authors: item.authors || [],
                    genres: item.genres || [],
                    coverUrl: item.coverUrl,
                    publicationYear: item.publicationYear,
                    publishedDate: item.publishedDate,
                    isFeatured: item.isFeatured,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
