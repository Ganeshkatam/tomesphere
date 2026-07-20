import { LibraryBookDto } from "./LibraryBookDto";
import { CollectionDto } from "./CollectionDto";

export interface LibrarySummaryDto {
  totalBooks: number;
  totalCollections: number;
  currentlyReading: number;
  wantToRead: number;
  finished: number;
  downloaded: number;
  pagesRead: number;
  hoursRead: number;
  lastOpened: string | null;
}

export interface LibraryViewDto {
  id: string;
  type: "overview" | "status" | "collection" | "smart-filter";
  title: string;
  icon?: string;
  count?: number;
}

export interface SmartFilterDto extends LibraryViewDto {
  type: "smart-filter";
}

export interface LibraryNavigationDto {
  views: LibraryViewDto[];
  collections: LibraryViewDto[];
  smartFilters: SmartFilterDto[];
}

export interface LibraryBooksPageDto {
  items: LibraryBookDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LibraryFilterDto {
  formats: string[];
  authors: string[];
  genres: string[];
}

export interface LibraryPageDto {
  summary: LibrarySummaryDto;
  navigation: LibraryNavigationDto;
  books: LibraryBooksPageDto;
  filters: LibraryFilterDto;
}
