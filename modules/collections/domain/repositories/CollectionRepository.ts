import { Collection } from "../entities/Collection";

export interface CollectionRepository {
  findById(id: string): Promise<Collection | null>;
  list(): Promise<Collection[]>;
  save(entity: Collection): Promise<void>;
  delete(id: string): Promise<void>;
  updateBooks(collectionId: string, bookIds: string[]): Promise<void>;
}
