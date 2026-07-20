export interface AuthorSummaryDto {
  id: string;
  name: string;
  slug: string;
}

export interface GenreSummaryDto {
  id: string;
  name: string;
  slug: string;
}

export interface SubjectSummaryDto {
  id: string;
  name: string;
  slug: string;
}

export interface BookDto {
  id: string;
  title: string;
  authors: AuthorSummaryDto[];
  genres: GenreSummaryDto[];
  subjects: SubjectSummaryDto[];
  coverUrl: string | null;
  isTextbook: boolean;
  language?: string | null;
  publishedDate?: string | null;
  isFeatured?: boolean;
  files: {
    id: string;
    format: string;
    storagePath: string;
    isPrimary: boolean;
  }[];
  createdAt?: string | null;
  description?: string | null;
  isbn?: string | null;
  pageCount?: number | null;
  averageRating?: number;
}
