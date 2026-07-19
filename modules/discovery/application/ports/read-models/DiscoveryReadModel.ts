import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { DiscoveryOverviewDto } from "../../queries/GetDiscoveryOverview/read-model";
import { SearchResultDto } from "../../queries/SearchBooks/read-model";
import { GetTrendingBooksQuery } from "../../queries/GetTrendingBooks/query";
import { TrendingBooksResponseDto } from "../../queries/GetTrendingBooks/response";

export interface DiscoveryReadModel {
  getOverview(): Promise<DiscoveryOverviewDto>;
  searchBooks(query: string, genre: string, page: number, pageSize: number, sort: string): Promise<SearchResultDto>;
  getSearchSuggestions(query: string): Promise<Partial<BookDto>[]>;
  getTrendingBooks(query: GetTrendingBooksQuery): Promise<TrendingBooksResponseDto>;
}
