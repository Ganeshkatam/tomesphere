import { BookDto } from "@/modules/library/application/dto/response/BookDto";

export interface DiscoveryOverviewDto {
  readonly featuredBooks: BookDto[];
  readonly trendingBooks: BookDto[];
  readonly newBooks: BookDto[];
  readonly featuredCollections: any[];
  readonly genres: string[];
  readonly subjects: string[];
  readonly languages: string[];
  readonly authors: string[];
}
