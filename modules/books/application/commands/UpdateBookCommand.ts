import { BookRepository } from "../../domain/repositories/BookRepository";
import { BookId } from "../../domain/value-objects";

export interface UpdateBookCommand {
  id: string;
  title?: string;
  description?: string;
  genres?: string[];
  subjects?: string[];
}

export class UpdateBookHandler {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: UpdateBookCommand): Promise<void> {
    const book = await this.repository.findById(BookId.create(command.id));

    if (!book) {
      throw new Error(`Book with id ${command.id} not found`);
    }

    const updates: any = {};
    if (command.title !== undefined) updates.title = command.title;
    if (command.description !== undefined)
      updates.description = command.description;
    if (command.genres !== undefined) updates.genres = command.genres;
    if (command.subjects !== undefined) updates.subjects = command.subjects;

    book.updateDetails(updates);

    await this.repository.save(book);
  }
}
