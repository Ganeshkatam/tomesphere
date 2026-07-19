import { RemoveIndexedBookCommand } from "./command";
import { RemoveIndexedBookOutput } from "./output";
import { SearchRepository } from "../../../domain/repositories/SearchRepository";

export class RemoveIndexedBookHandler {
  constructor(private readonly searchRepository: SearchRepository) {}

  async execute(
    command: RemoveIndexedBookCommand,
  ): Promise<RemoveIndexedBookOutput> {
    try {
      await this.searchRepository.removeIndex(command.input.bookId);

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(error instanceof Error
            ? error.message
            : "Unknown error removing index",
      );
    }
  }
}
