import { LibraryReadModel } from "../../ports/read-models/LibraryReadModel";
import { LibrarySummaryDto } from "../../dto/response/LibraryPageDto";

export async function getLibrarySummary(
  readModel: LibraryReadModel,
  userId: string,
): Promise<LibrarySummaryDto> {
  return readModel.getLibrarySummary(userId);
}
