import { CollectionDto } from "../../application/dto/response/CollectionDto";

export interface CollectionRepository {
  getCollections(userId: string): Promise<CollectionDto[]>;
  getCollection(id: string, userId: string): Promise<CollectionDto | null>;
  createCollection(userId: string, data: { name: string; description?: string; isPublic?: boolean }): Promise<CollectionDto>;
  updateCollection(id: string, userId: string, data: { name?: string; description?: string; isPublic?: boolean }): Promise<CollectionDto | null>;
  deleteCollection(id: string, userId: string): Promise<boolean>;
}
