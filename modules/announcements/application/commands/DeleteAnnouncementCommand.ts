import { AnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";

export interface DeleteAnnouncementCommand {
  id: string;
}

export class DeleteAnnouncementHandler {
  constructor(private readonly repository: AnnouncementRepository) {}

  async execute(command: DeleteAnnouncementCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
