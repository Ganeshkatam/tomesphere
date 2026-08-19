import { CollectionRecord } from "../models/Collection";

export interface CollectionRepository {
  getCollections(userId: string): Promise<CollectionRecord[]>;
  getCollection(id: string, userId: string): Promise<CollectionRecord | null>;
  createCollection(
    userId: string,
    data: { name: string; description?: string; isPublic?: boolean },
  ): Promise<CollectionRecord>;
  updateCollection(
    id: string,
    userId: string,
    data: { name?: string; description?: string; isPublic?: boolean },
  ): Promise<CollectionRecord | null>;
  deleteCollection(id: string, userId: string): Promise<boolean>;

  addBook(collectionId: string, bookId: string, userId: string): Promise<void>;
  removeBook(
    collectionId: string,
    bookId: string,
    userId: string,
  ): Promise<void>;
}
