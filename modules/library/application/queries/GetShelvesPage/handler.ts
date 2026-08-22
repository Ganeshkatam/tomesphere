import { LibraryReadModel } from "../../ports/read-models/LibraryReadModel";
import { ShelvesPageDto } from "../../dto/response/ShelvesPageDto";

export async function getShelvesPage(
  readModel: LibraryReadModel,
  userId: string,
): Promise<ShelvesPageDto> {
  const result = await readModel.getShelvesWithPreviews(userId);
  return result;
}
