import { BookMapper } from "./BookMapper";
import type { BookRow } from "../models/BookRow";

// We do not have a testing framework installed yet (like Vitest or Jest).
// This file serves as the architectural reference for future contract tests.

function mockBookRow(): BookRow {
  return {
    id: "123-abc",
    title: "The Great Gatsby",
    cover_url: null,
    description: null,
    is_textbook: false,
    release_date: "1925-04-10",
    pages: 208,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    download_count: 0,
    edition: null,
    embedding: null,
    epub_url: null,
    file_size: null,
    file_size_mb: null,
    format: null,
    fts: null,
    hash: null,
    is_featured: false,
    isbn: null,
    language: "en",
    pdf_url: null,
    publisher: "Scribner",
    series: null,
    series_order: null,
    total_pages: 208,
    view_count: 0,
  };
}

export function testBookMapper() {
  const raw = mockBookRow();
  const domain = BookMapper.toDomain(raw);

  if (domain.title !== "The Great Gatsby")
    throw new Error("Mapper failed title");
  if (!domain.isPublicDomain()) throw new Error("Mapper failed domain logic");

  console.log("BookMapper tests passed");
}
