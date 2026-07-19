import { SearchRepository } from "../../../domain/repositories/SearchRepository";
import { SearchQuery } from "../../../domain/value-objects/SearchQuery";
import { BookSearchDocument } from "../../models/BookSearchDocument";

export class InMemorySearchRepository implements SearchRepository {
  private documents: Map<string, BookSearchDocument> = new Map();

  async search(
    query: SearchQuery,
  ): Promise<{ documents: BookSearchDocument[]; totalCount: number }> {
    let results = Array.from(this.documents.values());

    // Simple text search mock
    if (query.text) {
      const lowerText = query.text.toLowerCase();
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerText) ||
          (doc.description &&
            doc.description.toLowerCase().includes(lowerText)) ||
          doc.keywords.some((k: string) => k.includes(lowerText)),
      );
    }

    // Apply filters
    if (query.filters.authors && query.filters.authors.length > 0) {
      results = results.filter((doc) =>
        query.filters.authors!.some((a: string) => doc.authors.includes(a)),
      );
    }
    if (query.filters.categories && query.filters.categories.length > 0) {
      results = results.filter((doc) =>
        query.filters.categories!.some((c: string) =>
          doc.categories.includes(c),
        ),
      );
    }
    if (query.filters.language) {
      results = results.filter(
        (doc) => doc.language === query.filters.language,
      );
    }

    const totalCount = results.length;

    // Mock deterministic sort for pagination
    results.sort((a, b) => a.bookId.localeCompare(b.bookId));

    // Pagination
    const paginated = results.slice(
      query.pagination.offset,
      query.pagination.offset + query.pagination.limit,
    );

    return { documents: paginated, totalCount };
  }

  async index(document: BookSearchDocument): Promise<void> {
    this.documents.set(document.bookId, document);
  }

  async updateIndex(
    bookId: string,
    updates: Partial<BookSearchDocument>,
  ): Promise<void> {
    const doc = this.documents.get(bookId);
    if (doc) {
      this.documents.set(bookId, { ...doc, ...updates });
    }
  }

  async removeIndex(bookId: string): Promise<void> {
    this.documents.delete(bookId);
  }
}
