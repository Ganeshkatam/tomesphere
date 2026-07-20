import { Author } from "../entities/Author";

export interface AuthorRepository {
  findById(id: string): Promise<Author | null>;
  save(author: Author): Promise<void>;
  delete(id: string): Promise<void>;
}
