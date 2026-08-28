import { BookSummaryDto } from "../../dto/BookSummaryDto";
import { AuthorCardDto } from "../../dto/AuthorCardDto";
import { CollectionSummaryDto } from "../../dto/CollectionSummaryDto";

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
  readonly featuredCollections: CollectionSummaryDto[];
  readonly topAuthors: AuthorCardDto[];
  readonly genres: string[];
  readonly subjects: string[];
  readonly languages: string[];
  readonly authors: string[];
}
