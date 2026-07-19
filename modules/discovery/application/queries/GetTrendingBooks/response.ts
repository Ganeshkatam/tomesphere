export interface TrendingBookDto {
  readonly id: string;
  readonly title: string;
  readonly authors: { id: string; name: string }[];
  readonly coverUrl: string | null;
  readonly genres: { id: string; name: string }[];
  readonly subjects: { id: string; name: string }[];
  readonly language: string | null;
  readonly trendingScore: number;
  readonly rank: number;
  readonly isFeatured: boolean;
}

export interface TrendingBooksResponseDto {
  readonly books: TrendingBookDto[];
  readonly period: string;
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly updatedAt: string;
}
