export type SearchSuggestionType =
  "Book" | "Author" | "Genre" | "Subject" | "Series" | "Collection";

export interface SearchSuggestionDto {
  type: SearchSuggestionType;
  title: string;
  subtitle?: string;
  icon?: string; // Optional icon identifier (e.g. "book-open", "user", "tag")
  url: string; // The URL to navigate to when clicked (e.g. /book/123, /search?facet.author=rowling)
}
