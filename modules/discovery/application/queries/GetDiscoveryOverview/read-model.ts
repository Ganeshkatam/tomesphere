import { BookSummaryDto } from "../../dto/BookSummaryDto";

export interface DiscoverySectionDto {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description?: string;
  readonly actionHref?: string;
  readonly actionLabel?: string;
  readonly iconName?: string;
  readonly iconBg?: string;
  readonly books: BookSummaryDto[];
}

export interface DiscoveryOverviewDto {
  readonly featuredBooks: BookSummaryDto[];
  readonly trendingBooks: BookSummaryDto[];
  readonly newBooks: BookSummaryDto[];
  readonly sections: DiscoverySectionDto[];
  readonly featuredCollections: any[];
  readonly genres: string[];
  readonly subjects: string[];
  readonly languages: string[];
  readonly authors: string[];
}
