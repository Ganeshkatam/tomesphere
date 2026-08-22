export interface ShelfBookPreviewDto {
  bookId: string;
  title: string;
  coverUrl: string | null;
}

export interface ShelfSummaryDto {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  bookCount: number;
  previewBooks: ShelfBookPreviewDto[];
}

export interface ShelvesPageDto {
  shelves: ShelfSummaryDto[];
  totalShelves: number;
}
