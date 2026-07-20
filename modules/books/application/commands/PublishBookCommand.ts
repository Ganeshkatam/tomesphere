import { BookRepository } from "../../domain/repositories/BookRepository";
import { BookId } from "../../domain/value-objects";

export interface PublishBookCommand {
  id: string;
}

export class PublishBookHandler {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: PublishBookCommand): Promise<void> {
    const book = await this.repository.findById(BookId.create(command.id));

    if (!book) {
      throw new Error(`Book with id ${command.id} not found`);
    }

    book.publish();

    await this.repository.save(book);
  }
}
