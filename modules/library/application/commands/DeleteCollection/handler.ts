import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";

export interface DeleteCollectionRequest {
  id: string;
  userId: string;
}

export async function deleteCollection(
  repository: CollectionRepository,
  request: DeleteCollectionRequest,
): Promise<boolean> {
  return repository.deleteCollection(request.id, request.userId);
}
