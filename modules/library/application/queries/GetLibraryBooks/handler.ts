import {
  LibraryReadModel,
  LibraryQueryParams,
} from "../../ports/read-models/LibraryReadModel";
import { LibraryBooksPageDto } from "../../dto/response/LibraryPageDto";

export async function getLibraryBooks(
  readModel: LibraryReadModel,
  userId: string,
  params: LibraryQueryParams,
): Promise<LibraryBooksPageDto> {
  return readModel.getLibraryBooks(userId, params);
}
