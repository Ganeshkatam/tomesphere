import { Announcement } from "../entities/Announcement";

export interface AnnouncementRepository {
  findById(id: string): Promise<Announcement | null>;
  list(): Promise<Announcement[]>;
  save(entity: Announcement): Promise<void>;
  delete(id: string): Promise<void>;
}
