import { BookFile } from "../value-objects/BookFile";

export interface BookFileRepository {
  save(bookId: string, file: BookFile): Promise<void>;
  delete(id: string): Promise<void>;
}
