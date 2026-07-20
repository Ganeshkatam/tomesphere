import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";
import { CollectionDto } from "../../dto/response/CollectionDto";

export interface UpdateCollectionRequest {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export async function updateCollection(
  repository: CollectionRepository,
  request: UpdateCollectionRequest,
): Promise<CollectionDto | null> {
  return repository.updateCollection(request.id, request.userId, {
    name: request.name,
    description: request.description,
    isPublic: request.isPublic,
  });
}
