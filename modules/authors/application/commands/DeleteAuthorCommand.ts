import { AuthorRepository } from "../../domain/repositories/AuthorRepository";

export interface DeleteAuthorCommand {
  id: string;
}

export class DeleteAuthorHandler {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: DeleteAuthorCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
