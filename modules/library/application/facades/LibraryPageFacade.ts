import { LibraryPageDto } from "../dto/response/LibraryPageDto";
import { getLibrarySummary } from "../queries/GetLibrarySummary/handler";
import { getLibraryNavigation } from "../queries/GetLibraryNavigation/handler";
import { getLibraryBooks } from "../queries/GetLibraryBooks/handler";
import { getLibraryFilters } from "../queries/GetLibraryFilters/handler";
import {
  LibraryReadModel,
  LibraryQueryParams,
} from "../ports/read-models/LibraryReadModel";
import { CollectionRepository } from "../../domain/repositories/CollectionRepository";

export class LibraryPageFacade {
  constructor(
    private readonly libraryReadModel: LibraryReadModel,
    private readonly collectionRepository: CollectionRepository,
  ) {}

  async get(
    userId: string,
    params: LibraryQueryParams,
  ): Promise<LibraryPageDto> {
    const [summary, navigation, books, filters] = await Promise.all([
      getLibrarySummary(this.libraryReadModel, userId),
      getLibraryNavigation(this.collectionRepository, userId),
      getLibraryBooks(this.libraryReadModel, userId, params),
      getLibraryFilters(userId),
    ]);

    return {
      summary,
      navigation,
      books,
      filters,
    };
  }
}
