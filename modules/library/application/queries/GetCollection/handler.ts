import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";
import { CollectionDto } from "../../dto/response/CollectionDto";

export async function getCollection(
  repository: CollectionRepository,
  id: string,
  userId: string
): Promise<CollectionDto | null> {
  return repository.getCollection(id, userId);
}
