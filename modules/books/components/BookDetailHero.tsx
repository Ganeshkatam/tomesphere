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
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";
import { addBookToLibraryAction } from "@/modules/library/presentation/actions/library";
import BookCard from "@/modules/books/components/BookCard";
import DefaultBookCover from "./DefaultBookCover";

interface BookDetailHeroProps {
  book: BookDetailDto;
  viewer?: BookViewerContextDto;
  relatedBooks?: any[];
}

export function BookDetailHero({ book, viewer, relatedBooks = [] }: BookDetailHeroProps) {
  const [inLibrary, setInLibrary] = useState(viewer?.libraryStatus === "in_library");
  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const authorNames = book.authors?.map((a) => a.name).join(", ") || "Public Domain";
  const year = book.publishedDate
    ? new Date(book.publishedDate).getFullYear()
    : "Historic Archive";
  const primaryGenre = book.genres?.[0]?.name || "Literature";
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

  const handleToggleLibrary = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addBookToLibraryAction(book.id, "want_to_read");
      setInLibrary(true);
    } catch {
      // fallback
    } finally {
      setIsAdding(false);
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
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

  return (
    <div className="w-full space-y-10 sm:space-y-14">
      
      {/* 1. Breadcrumb Navigation Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link
            href="/me"
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Library</span>
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
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>{primaryGenre}</span>
                </span>
                {book.genres?.slice(1, 3).map((g: any, idx: number) => (
                  <span
                    key={g.id || g.name || `genre-${idx}`}
                    className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                  >
                    {typeof g === "string" ? g : g.name}
                  </span>
                ))}
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  Public Domain
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-2">
                {book.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2">
                <span>by {authorNames}</span>
              </p>
            </div>

            {/* Primary Action Buttons (Immediately Accessible) */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <Link
                href={`/read/${book.id}`}
                className="h-12 sm:h-13 px-8 sm:px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Play size={18} className="fill-white text-white translate-x-0.5" />
                <span>Start Reading</span>
              </Link>

              <button
                onClick={handleToggleLibrary}
                disabled={isAdding}
                className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                  inLibrary
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                }`}
              >
                {inLibrary ? (
                  <>
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>In Library</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>{isAdding ? "Adding..." : "Add to Library"}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="h-12 sm:h-13 px-4 sm:px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                title="Share link"
              >
                <Share2 size={16} />
                <span className="text-xs font-semibold">
                  {copied ? "Copied!" : "Share"}
                </span>
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
                  {book.pageCount ? `${Math.round(book.pageCount * 1.5)} mins` : "~4 hours"}
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
          
          {/* Provenance Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span>Archival Specifications</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Archive Origin</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">TomeSphere Open Library</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Licensing</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Public Domain / CC0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Digital Format</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Unabridged High-Res PDF</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Reader Compatibility</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Desktop, Tablet, Mobile</span>
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

      {/* 4. Related Works Shelf */}
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
