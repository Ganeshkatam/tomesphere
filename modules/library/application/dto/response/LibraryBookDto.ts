export interface LibraryBookDto {
  bookId: string;
  title: string;
  coverUrl: string | null;
  authors: { id: string; name: string }[];
  progress: number;
  status: "want_to_read" | "reading" | "finished" | "abandoned";
  collections: string[]; // Array of collection IDs
  dateAdded: string;
  lastOpened: string | null;
  favorite: boolean;
  format?: string; // e.g., "epub" | "pdf"
  currentPage?: number;
  totalPages?: number;
}
