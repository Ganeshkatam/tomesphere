"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Feather } from "lucide-react";
import { AuthorCardDto } from "../../application/dto/AuthorCardDto";
import { useMemo } from "react";

interface AuthorCardProps {
  author: AuthorCardDto;
  index?: number;
}

const AUTHOR_GRADIENTS = [
  {
    gradient: "from-indigo-600 via-indigo-700 to-purple-800",
    shadow: "shadow-indigo-500/25",
    border: "border-indigo-400/30",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  {
    gradient: "from-purple-600 via-purple-700 to-pink-800",
    shadow: "shadow-purple-500/25",
    border: "border-purple-400/30",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    shadow: "shadow-emerald-500/25",
    border: "border-emerald-400/30",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    gradient: "from-rose-600 via-pink-700 to-amber-800",
    shadow: "shadow-rose-500/25",
    border: "border-rose-400/30",
    accent: "text-rose-600 dark:text-rose-400",
  },
  {
    gradient: "from-blue-600 via-cyan-700 to-teal-800",
    shadow: "shadow-blue-500/25",
    border: "border-blue-400/30",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    gradient: "from-amber-600 via-orange-700 to-rose-800",
    shadow: "shadow-amber-500/25",
    border: "border-amber-400/30",
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    gradient: "from-teal-600 via-emerald-700 to-green-800",
    shadow: "shadow-teal-500/25",
    border: "border-teal-400/30",
    accent: "text-teal-600 dark:text-teal-400",
  },
  {
    gradient: "from-violet-600 via-fuchsia-700 to-rose-800",
    shadow: "shadow-violet-500/25",
    border: "border-violet-400/30",
    accent: "text-violet-600 dark:text-violet-400",
  },
];

export function AuthorCard({ author, index = 0 }: AuthorCardProps) {
  // Deterministic theme selection based on author name or index
  const theme = useMemo(() => {
    let hash = index;
    for (let i = 0; i < author.name.length; i++) {
      hash = (hash + author.name.charCodeAt(i)) % AUTHOR_GRADIENTS.length;
    }
    return AUTHOR_GRADIENTS[hash];
  }, [author.name, index]);

  // Extract up to 2 initials
  const initials = useMemo(() => {
    const parts = author.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "A";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [author.name]);

  return (
    <Link
      href={`/discover/authors/${author.slug || author.id}`}
      className="group relative flex flex-col items-center justify-between text-center p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[170px]"
    >
      {/* Top: Avatar (Image or Monogram) */}
      <div className="relative mb-3">
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md ${theme.shadow} border ${theme.border} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
        >
          {author.imageUrl ? (
            <Image
              src={author.imageUrl.replace(/ /g, "%20")}
              alt={author.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}
            >
              {/* Subtle watermark feather */}
              <Feather className="absolute -right-2 -bottom-2 w-10 h-10 text-white/10 rotate-12" />

              {/* Serif Monogram Initials */}
              <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-widest drop-shadow-sm select-none">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Full Readable Author Name */}
      <div className="w-full flex-1 flex flex-col justify-center">
        <h4
          className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          title={author.name}
        >
          {author.name}
        </h4>
      </div>

      {/* Bottom: Book Count Pill Badge */}
      <div className="mt-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/70 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
          <BookOpen size={11} />
          <span>{author.bookCount} {author.bookCount === 1 ? "work" : "works"}</span>
        </span>
      </div>
    </Link>
  );
}

export default AuthorCard;
