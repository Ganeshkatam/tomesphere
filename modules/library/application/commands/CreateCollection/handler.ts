import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";
import { CollectionDto } from "../../dto/response/CollectionDto";

export interface CreateCollectionRequest {
  userId: string;
  name: string;
  description?: string;
  isPublic?: boolean;
}

export async function createCollection(
  repository: CollectionRepository,
  request: CreateCollectionRequest
): Promise<CollectionDto> {
  return repository.createCollection(request.userId, {
    name: request.name,
    description: request.description,
    isPublic: request.isPublic,
  });
}
