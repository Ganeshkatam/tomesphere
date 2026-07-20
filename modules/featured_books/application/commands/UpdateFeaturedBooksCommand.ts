import { FeaturedBookRepository } from "../../domain/repositories/FeaturedBookRepository";
import { FeaturedBook } from "../../domain/entities/FeaturedBook";

export interface UpdateFeaturedBooksCommand {
  books: FeaturedBook[];
}

export class UpdateFeaturedBooksHandler {
  constructor(private readonly repository: FeaturedBookRepository) {}

  async execute(command: UpdateFeaturedBooksCommand): Promise<void> {
    await this.repository.saveAll(command.books);
  }
}
