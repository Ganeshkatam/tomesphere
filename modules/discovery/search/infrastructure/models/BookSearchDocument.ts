// This is a purely projection model. It is optimized for indexing and querying.
// It contains NO business invariants or behavior.
export interface BookSearchDocument {
  bookId: string;
  title: string;
  subtitle?: string;
  authors: string[];
  categories: string[];
  language: string;
  description?: string;
  keywords: string[];
  // embeddings: number[]; // Future: Phase 7B
  // searchTokens: string; // Used internally by Postgres FTS
  publicationYear?: number;
  availabilityStatus: "available" | "coming_soon" | "out_of_print";
  popularityScore: number;
  rating: number;
}
