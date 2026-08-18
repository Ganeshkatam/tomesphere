import { BookSummaryDto } from "../../dto/BookSummaryDto";

export interface TrendingBookDto extends BookSummaryDto {
  readonly trendingScore: number;
  readonly rank: number;
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
