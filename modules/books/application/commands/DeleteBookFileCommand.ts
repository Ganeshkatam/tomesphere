import { BookFileRepository } from "../../domain/repositories/BookFileRepository";

export interface DeleteBookFileCommand {
  id: string;
}

export class DeleteBookFileHandler {
  constructor(private readonly repository: BookFileRepository) {}

  async execute(command: DeleteBookFileCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
