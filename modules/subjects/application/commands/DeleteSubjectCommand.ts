import { SubjectRepository } from "../../domain/repositories/SubjectRepository";

export interface DeleteSubjectCommand {
  id: string;
}

export class DeleteSubjectHandler {
  constructor(private readonly repository: SubjectRepository) {}

  async execute(command: DeleteSubjectCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
