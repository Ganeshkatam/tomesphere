import { DiscoveryReadModel } from "../ports/read-models/DiscoveryReadModel";
import { searchBooks } from "../queries/SearchBooks/handler";
import { getTrendingBooks } from "../queries/GetTrendingBooks/handler";

import { GetFeaturedBooksHandler } from "../queries/GetFeaturedBooks/handler";
import { GetNewArrivalsHandler } from "../queries/GetNewArrivals/handler";
import { GetCollectionsHandler } from "../queries/GetCollections/handler";
import { GetGenresHandler } from "../queries/GetGenres/handler";
import { GetAuthorsHandler } from "../queries/GetAuthors/handler";
import { GetLanguagesHandler } from "../queries/GetLanguages/handler";
import { GetSubjectsHandler } from "../queries/GetSubjects/handler";

import { GetFeaturedBooksResponseDto } from "../queries/GetFeaturedBooks/response";
import { GetNewArrivalsResponseDto } from "../queries/GetNewArrivals/response";
import { GetCollectionsResponseDto } from "../queries/GetCollections/response";
import { GetGenresResponseDto } from "../queries/GetGenres/response";
import { GetAuthorsResponseDto } from "../queries/GetAuthors/response";
import { GetLanguagesResponseDto } from "../queries/GetLanguages/response";
import { GetSubjectsResponseDto } from "../queries/GetSubjects/response";
import { TrendingBooksResponseDto } from "../queries/GetTrendingBooks/response";
import { SearchResultDto } from "../queries/SearchBooks/read-model";
import { DiscoveryOverviewDto } from "../queries/GetDiscoveryOverview/read-model";

export interface DiscoveryOverviewPageDto {
  overview: DiscoveryOverviewDto;
  trending: TrendingBooksResponseDto;
  featured: GetFeaturedBooksResponseDto;
  newArrivals: GetNewArrivalsResponseDto;
  collections: GetCollectionsResponseDto;
  genres: GetGenresResponseDto;
  authors: GetAuthorsResponseDto;
  languages: GetLanguagesResponseDto;
  subjects: GetSubjectsResponseDto;
}

export class DiscoveryFacade {
  private getFeaturedHandler: GetFeaturedBooksHandler;
  private getNewArrivalsHandler: GetNewArrivalsHandler;
  private getCollectionsHandler: GetCollectionsHandler;
  private getGenresHandler: GetGenresHandler;
  private getAuthorsHandler: GetAuthorsHandler;
  private getLanguagesHandler: GetLanguagesHandler;
  private getSubjectsHandler: GetSubjectsHandler;

  constructor(private readonly discoveryReadModel: DiscoveryReadModel) {
    this.getFeaturedHandler = new GetFeaturedBooksHandler(discoveryReadModel);
    this.getNewArrivalsHandler = new GetNewArrivalsHandler(discoveryReadModel);
    this.getCollectionsHandler = new GetCollectionsHandler(discoveryReadModel);
    this.getGenresHandler = new GetGenresHandler(discoveryReadModel);
    this.getAuthorsHandler = new GetAuthorsHandler(discoveryReadModel);
    this.getLanguagesHandler = new GetLanguagesHandler(discoveryReadModel);
    this.getSubjectsHandler = new GetSubjectsHandler(discoveryReadModel);
  }

  async getDiscoveryOverview(): Promise<DiscoveryOverviewDto> {
    return this.discoveryReadModel.getOverview();
  }

  async getOverview(): Promise<DiscoveryOverviewPageDto> {
    const [
      overview,
      trending,
      featured,
      newArrivals,
      collections,
      genres,
      authors,
      languages,
      subjects,
    ] = await Promise.all([
      this.discoveryReadModel.getOverview(),
      getTrendingBooks(this.discoveryReadModel, {
        period: "weekly",
        limit: 6,
        page: 1,
      }),
      this.getFeaturedHandler.execute({ limit: 6, page: 1 }),
      this.getNewArrivalsHandler.execute({ limit: 6, page: 1 }),
      this.getCollectionsHandler.execute({ limit: 6, page: 1 }),
      this.getGenresHandler.execute({ limit: 10, page: 1 }),
      this.getAuthorsHandler.execute({ limit: 10, page: 1 }),
      this.getLanguagesHandler.execute({ limit: 10, page: 1 }),
      this.getSubjectsHandler.execute({ limit: 10, page: 1 }),
    ]);

    return {
      overview,
      trending,
      featured,
      newArrivals,
      collections,
      genres,
      authors,
      languages,
      subjects,
    };
  }

  async getTrending(params: {
    period: "daily" | "weekly" | "monthly" | "all-time";
    limit: number;
    page: number;
    genre?: string;
  }): Promise<TrendingBooksResponseDto> {
    return getTrendingBooks(this.discoveryReadModel, params);
  }

  async getFeatured(params: {
    limit: number;
    page: number;
  }): Promise<GetFeaturedBooksResponseDto> {
    return this.getFeaturedHandler.execute(params);
  }

  async getNewArrivals(params: {
    limit: number;
    page: number;
  }): Promise<GetNewArrivalsResponseDto> {
    return this.getNewArrivalsHandler.execute(params);
  }

  async getCollections(params: {
    limit: number;
    page: number;
  }): Promise<GetCollectionsResponseDto> {
    return this.getCollectionsHandler.execute(params);
  }

  async getGenres(params: {
    limit: number;
    page: number;
  }): Promise<GetGenresResponseDto> {
    return this.getGenresHandler.execute(params);
  }

  async getAuthors(params: {
    limit: number;
    page: number;
  }): Promise<GetAuthorsResponseDto> {
    return this.getAuthorsHandler.execute(params);
  }

  async getLanguages(params: {
    limit: number;
    page: number;
  }): Promise<GetLanguagesResponseDto> {
    return this.getLanguagesHandler.execute(params);
  }

  async getSubjects(params: {
    limit: number;
    page: number;
  }): Promise<GetSubjectsResponseDto> {
    return this.getSubjectsHandler.execute(params);
  }

  async search(params: {
    term?: string;
    genre?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<SearchResultDto> {
    return searchBooks(this.discoveryReadModel, params);
  }
}
