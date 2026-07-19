export type SearchMode = "keyword" | "semantic" | "hybrid";
export type SortOption = "relevance" | "rating" | "popularity" | "newest";

export interface SearchFilters {
  language?: string;
  categories?: string[];
  authors?: string[];
  publicationYear?: number;
  availability?: "available" | "coming_soon" | "out_of_print";
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface SearchQueryProps {
  text: string;
  mode?: SearchMode;
  filters?: SearchFilters;
  sort?: SortOption;
  pagination?: PaginationOptions;
}

export class SearchQuery {
  public readonly text: string;
  public readonly mode: SearchMode;
  public readonly filters: SearchFilters;
  public readonly sort: SortOption;
  public readonly pagination: PaginationOptions;

  private constructor(props: SearchQueryProps) {
    this.text = props.text.trim();
    this.mode = props.mode || "keyword"; // Phase 7A default
    this.filters = props.filters || {};
    this.sort = props.sort || "relevance";
    this.pagination = props.pagination || { limit: 20, offset: 0 };
  }

  public static create(props: SearchQueryProps): SearchQuery {
    const text = props.text?.trim() || "";

    if (!text && (!props.filters || Object.keys(props.filters).length === 0)) {
      throw new Error("Search query must have either text or filters");
    }

    // Clamp pagination
    let limit = props.pagination?.limit ?? 20;
    limit = Math.max(1, Math.min(limit, 100)); // Clamp between 1 and 100

    let offset = props.pagination?.offset ?? 0;
    offset = Math.max(0, offset); // Clamp >= 0

    return new SearchQuery({
      ...props,
      text,
      pagination: { limit, offset },
    });
  }

  // Example of domain behavior for a value object
  public withPage(pageNumber: number): SearchQuery {
    const offset = Math.max(0, (pageNumber - 1) * this.pagination.limit);
    return new SearchQuery({
      text: this.text,
      mode: this.mode,
      filters: this.filters,
      sort: this.sort,
      pagination: { limit: this.pagination.limit, offset },
    });
  }
}
