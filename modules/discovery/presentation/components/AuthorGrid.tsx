"use client";

import { AuthorCardDto } from "../../application/dto/AuthorCardDto";
import { AuthorCard } from "./AuthorCard";

interface AuthorGridProps {
  items: readonly AuthorCardDto[];
}

export function AuthorGrid({ items }: AuthorGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 min-w-0">
      {items.map((item, index) => (
        <AuthorCard key={item.id} author={item} index={index} />
      ))}
    </div>
  );
}
