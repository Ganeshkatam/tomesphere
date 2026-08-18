export interface AuthorSummaryDto {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
}

export interface GenreSummaryDto {
  readonly id: string;
  readonly name: string;
}

export interface BookSummaryDto {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly authors: readonly AuthorSummaryDto[];
  readonly genres: readonly GenreSummaryDto[];
  readonly coverUrl: string | null;
  readonly language: string | null;
  readonly publicationYear: number | null;
}
