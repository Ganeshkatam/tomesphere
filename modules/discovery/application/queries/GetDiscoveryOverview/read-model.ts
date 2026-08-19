import { BookSummaryDto } from "../../dto/BookSummaryDto";

export interface DiscoveryOverviewDto {
  readonly featuredBooks: BookSummaryDto[];
  readonly trendingBooks: BookSummaryDto[];
  readonly newBooks: BookSummaryDto[];
  readonly classicsBooks?: BookSummaryDto[];
  readonly philosophyBooks?: BookSummaryDto[];
  readonly scienceBooks?: BookSummaryDto[];
  readonly historyBooks?: BookSummaryDto[];
  readonly curatedBooks?: BookSummaryDto[];
  readonly featuredCollections: any[];
  readonly genres: string[];
  readonly subjects: string[];
  readonly languages: string[];
  readonly authors: string[];
}
