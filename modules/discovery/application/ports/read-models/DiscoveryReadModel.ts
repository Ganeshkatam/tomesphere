import { BookSummaryDto } from "../../dto/BookSummaryDto";
import { DiscoveryOverviewDto } from "../../queries/GetDiscoveryOverview/read-model";
import { SearchResultDto } from "../../queries/SearchBooks/read-model";
import { GetTrendingBooksQuery } from "../../queries/GetTrendingBooks/query";
import { TrendingBooksResponseDto } from "../../queries/GetTrendingBooks/response";

export interface DiscoveryReadModel {
  getOverview(): Promise<DiscoveryOverviewDto>;
  searchBooks(
    query: string,
    genre: string,
    page: number,
    pageSize: number,
    sort: string,
  ): Promise<SearchResultDto>;
  getSearchSuggestions(query: string): Promise<Partial<BookSummaryDto>[]>;
  getTrendingBooks(
    query: GetTrendingBooksQuery,
  ): Promise<TrendingBooksResponseDto>;

  getFeaturedBooks(
    query: import("../../queries/GetFeaturedBooks/query").GetFeaturedBooksQuery,
  ): Promise<
    import("../../queries/GetFeaturedBooks/response").GetFeaturedBooksResponseDto
  >;
  getNewArrivals(
    query: import("../../queries/GetNewArrivals/query").GetNewArrivalsQuery,
  ): Promise<
    import("../../queries/GetNewArrivals/response").GetNewArrivalsResponseDto
  >;
  getCollections(
    query: import("../../queries/GetCollections/query").GetCollectionsQuery,
  ): Promise<
    import("../../queries/GetCollections/response").GetCollectionsResponseDto
  >;
  getGenres(
    query: import("../../queries/GetGenres/query").GetGenresQuery,
  ): Promise<import("../../queries/GetGenres/response").GetGenresResponseDto>;
  getAuthors(
    query: import("../../queries/GetAuthors/query").GetAuthorsQuery,
  ): Promise<import("../../queries/GetAuthors/response").GetAuthorsResponseDto>;
  getLanguages(
    query: import("../../queries/GetLanguages/query").GetLanguagesQuery,
  ): Promise<
    import("../../queries/GetLanguages/response").GetLanguagesResponseDto
  >;
  getSubjects(
    query: import("../../queries/GetSubjects/query").GetSubjectsQuery,
  ): Promise<
    import("../../queries/GetSubjects/response").GetSubjectsResponseDto
  >;
}
