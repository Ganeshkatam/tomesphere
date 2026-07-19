import { LibraryBook } from "@/modules/reading/library/domain/entities/LibraryBook";
import { LibraryEntryDto } from "../dto/response/LibraryEntryDto";

export class LibraryMapper {
  static toEntryDto(entity: LibraryBook): LibraryEntryDto {
    return {
      userId: entity.userId.value,
      bookId: entity.bookId,
      state: entity.state.value,
      progress: entity.progress.value,
      startedAt: entity.timeline.startedAt?.toISOString(),
      finishedAt: entity.timeline.finishedAt?.toISOString(),
      lastOpenedAt: entity.timeline.lastOpenedAt?.toISOString(),
      isFavorite: entity.isFavorite,
    };
  }
}
