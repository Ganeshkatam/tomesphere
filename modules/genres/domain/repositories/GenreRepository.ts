import { Genre } from "../entities/Genre";

export interface GenreRepository {
  findById(id: string): Promise<Genre | null>;
  save(entity: Genre): Promise<void>;
  delete(id: string): Promise<void>;
}
