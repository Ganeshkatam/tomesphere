import { BookRepository } from "../../domain/repositories/BookRepository";
import { Book } from "../../domain/entities/Book";
import { BookId } from "../../domain/value-objects";

export interface CreateBookCommand {
  id: string;
  title: string;
  description?: string;
  authors: string[];
  genres: string[];
  subjects: string[];
  isTextbook?: boolean;
}

export class CreateBookHandler {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: CreateBookCommand): Promise<void> {
    const existing = await this.repository.findById(BookId.create(command.id));
    if (existing) {
      throw new Error(`Book with id ${command.id} already exists`);
    }

    const book = Book.create({
      id: BookId.create(command.id),
      title: command.title,
      description: command.description,
      authors: command.authors,
      genres: command.genres,
      subjects: command.subjects,
      isTextbook: command.isTextbook ?? false,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // In a real app, you might emit a BookCreatedEvent here if necessary,
    // but the basic state is saved.

    await this.repository.save(book);
  }
}
