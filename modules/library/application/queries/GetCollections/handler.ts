import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";
import { CollectionDto } from "../../dto/response/CollectionDto";

export async function getCollections(
  repository: CollectionRepository,
  userId: string,
): Promise<CollectionDto[]> {
  return repository.getCollections(userId);
}
