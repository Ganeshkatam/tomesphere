import {
  AuthorSummaryDto,
  GenreSummaryDto,
  SubjectSummaryDto,
} from "./BookDto";

export interface BookDetailDto {
  id: string;
  title: string;
  authors: AuthorSummaryDto[];
  genres: GenreSummaryDto[];
  subjects: SubjectSummaryDto[];
  coverUrl: string | null;
  description: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  isTextbook: boolean;
  isPublicDomain: boolean;
  files: {
    id: string;
    format: string;
    storagePath: string;
    isPrimary: boolean;
  }[];
}
