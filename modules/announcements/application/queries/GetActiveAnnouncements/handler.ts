import { AnnouncementReadModel } from "../../../application/ports/read-models/AnnouncementReadModel";
import { AnnouncementDto } from "../../dto/AnnouncementDto";

export class GetActiveAnnouncementsQueryHandler {
  constructor(private readonly repo: AnnouncementReadModel) {}

  async execute(): Promise<AnnouncementDto[]> {
    return await this.repo.getActiveAnnouncements();
  }
}
