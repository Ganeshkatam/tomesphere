export interface AnnotationSummaryDto {
  id: string;
  bookId: string;
  bookTitle?: string;
  bodyMarkdown: string;
  createdAt: string;
  updatedAt: string | null;
  
  // Supporting highlight data
  highlightId: string | null;
  highlightText: string | null;
  locationAnchor: any; // e.g., epub CFI or PDF location
}

export interface AnnotationsPageDto {
  items: AnnotationSummaryDto[];
  nextCursor: string | null;
}
