import { BookSummaryDto } from "../../dto/BookSummaryDto";

export interface SearchResultDto {
  readonly books: BookSummaryDto[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}
