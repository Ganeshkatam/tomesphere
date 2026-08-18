import { CollectionSummaryDto } from "../../dto/CollectionSummaryDto";

export interface GetCollectionsResponseDto {
  readonly items: readonly CollectionSummaryDto[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
