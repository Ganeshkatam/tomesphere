import { GenreRepository } from "../../domain/repositories/GenreRepository";

export interface DeleteGenreCommand {
  id: string;
}

export class DeleteGenreHandler {
  constructor(private readonly repository: GenreRepository) {}

  async execute(command: DeleteGenreCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
