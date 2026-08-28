import { AnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";
import { PermissionService } from "@/shared/kernel/security/PermissionService";
import { Permission } from "@/shared/kernel/security/Permission";

export interface CreateAnnouncementCommand {
  callerId: string;
  title: string;
  content: string;
  type: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible?: boolean;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export class CreateAnnouncementHandler {
  constructor(
    private readonly repository: AnnouncementRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(command: CreateAnnouncementCommand): Promise<string> {
    await this.permissionService.assertPermission(
      command.callerId,
      Permission.ManageAnnouncements,
    );

    const id = crypto.randomUUID();
    await this.repository.save({
      id,
      title: command.title,
      content: command.content,
      type: command.type,
      link_url: command.link_url,
      link_text: command.link_text,
      is_dismissible: command.is_dismissible ?? false,
      is_active: command.is_active ?? false,
      starts_at: command.starts_at,
      ends_at: command.ends_at,
    });
    return id;
  }
}
