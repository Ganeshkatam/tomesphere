export interface CollectionSummaryDto {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string | null;
  readonly bookCount: number;
}
