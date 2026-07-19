import { AnnouncementDto } from "../../dto/AnnouncementDto";

export interface AnnouncementReadModel {
  getActiveAnnouncements(): Promise<AnnouncementDto[]>;
}
