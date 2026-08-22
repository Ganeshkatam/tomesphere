import {
  LibraryBooksPageDto,
  LibrarySummaryDto,
} from "../../dto/response/LibraryPageDto";

export interface LibraryQueryParams {
  viewType: "overview" | "status" | "collection" | "smart-filter";
  viewId: string;
  sortBy?:
    | "title"
    | "author"
    | "date_added"
    | "date_opened"
    | "progress"
    | "publication_date";
  sortDirection?: "asc" | "desc";
  filters?: {
    formats?: string[];
    authors?: string[];
    genres?: string[];
  };
  page?: number;
  pageSize?: number;
}

export interface LibraryReadModel {
  getLibraryBooks(
    userId: string,
    params: LibraryQueryParams,
  ): Promise<LibraryBooksPageDto>;
  getLibrarySummary(userId: string): Promise<LibrarySummaryDto>;
  getShelvesWithPreviews(userId: string): Promise<any>;
}
