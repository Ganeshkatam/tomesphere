"use client";

import BookCardComponent, { BookCardModel } from "@/modules/books/components/BookCard";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";

interface BookCardProps {
  book: BookSummaryDto;
  priority?: boolean;
  onAddToList?: (status: "want_to_read" | "currently_reading" | "finished") => void;
}

export function BookCard({ book, priority = false, onAddToList }: BookCardProps) {
  const model: BookCardModel = {
    id: book.id,
    slug: book.slug,
    title: book.title,
    authors: book.authors || [],
    genres: book.genres || [],
    coverUrl: book.coverUrl ? book.coverUrl.replace(/ /g, "%20") : null,
    language: book.language,
    publicationYear: book.publicationYear,
  };

  return <BookCardComponent book={model} priority={priority} onAddToList={onAddToList} />;
}

export default BookCard;
