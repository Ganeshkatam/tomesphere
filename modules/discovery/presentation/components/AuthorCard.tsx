"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Feather } from "lucide-react";
import { AuthorCardDto } from "../../application/dto/AuthorCardDto";

interface AuthorCardProps {
  author: AuthorCardDto;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link
      href={`/discover/authors/${author.slug}`}
      className="group flex flex-col items-center text-center p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
        {author.imageUrl ? (
          <Image
            src={author.imageUrl.replace(/ /g, "%20")}
            alt={author.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <Feather className="w-8 h-8 text-indigo-500" />
        )}
      </div>

      <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {author.name}
      </h4>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
        {author.bookCount} {author.bookCount === 1 ? "work" : "works"}
      </p>
    </Link>
  );
}
