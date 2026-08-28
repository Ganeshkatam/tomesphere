import { BookSummaryDto } from "../../dto/BookSummaryDto";

export interface DiscoveryOverviewDto {
  readonly featuredBooks: BookSummaryDto[];
  readonly trendingBooks: BookSummaryDto[];
  readonly newBooks: BookSummaryDto[];
  readonly cybersecurityBooks?: BookSummaryDto[];
  readonly programmingBooks?: BookSummaryDto[];
  readonly mathematicsBooks?: BookSummaryDto[];
  readonly yogaBooks?: BookSummaryDto[];
  readonly philosophyBooks?: BookSummaryDto[];
  readonly biographyBooks?: BookSummaryDto[];
  readonly artBooks?: BookSummaryDto[];
  readonly scienceBooks?: BookSummaryDto[];
  readonly classicsBooks?: BookSummaryDto[];
  readonly historyBooks?: BookSummaryDto[];
  readonly curatedBooks?: BookSummaryDto[];
  readonly featuredCollections: any[];
  readonly genres: string[];
  readonly subjects: string[];
  readonly languages: string[];
  readonly authors: string[];
}
