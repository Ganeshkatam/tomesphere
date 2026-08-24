"use client";

import Link from "next/link";
import { AuthorCardDto } from "../../application/dto/AuthorCardDto";
import { AuthorCard } from "./AuthorCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Users, ArrowRight } from "lucide-react";

interface AuthorGridProps {
  items: readonly AuthorCardDto[];
}

export function AuthorGrid({ items }: AuthorGridProps) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} className="text-indigo-500" />}
        title="No Authors Cataloged Yet"
        description="We are cataloging new biographical author entries across the digital archives. Explore available books and authors in the main archive."
        action={
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore All Archives</span>
            <ArrowRight size={14} />
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 min-w-0">
      {items.map((item, index) => (
        <AuthorCard key={item.id} author={item} index={index} />
      ))}
    </div>
  );
}
