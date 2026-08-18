export interface GetNewArrivalsResponseDto {
  readonly items: readonly import("../../dto/BookSummaryDto").BookSummaryDto[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
