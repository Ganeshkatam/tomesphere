import { AnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";
import { Permission } from "@/shared/kernel/security/Permission";
import { PermissionService } from "@/shared/kernel/security/PermissionService";

export interface UpdateAnnouncementCommand {
  callerId: string;
  id: string;
  title?: string;
  content?: string;
  type?: string;
  link_url?: string | null;
  link_text?: string | null;
  is_dismissible?: boolean;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export class UpdateAnnouncementHandler {
  constructor(
    private readonly repository: AnnouncementRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(command: UpdateAnnouncementCommand): Promise<void> {
    await this.permissionService.assertPermission(
      command.callerId,
      Permission.ManageAnnouncements,
    );

    const entity = await this.repository.findById(command.id);
    if (!entity)
      throw new Error(`Announcement with id ${command.id} not found`);

    if (command.title !== undefined) entity.title = command.title;
    if (command.content !== undefined) entity.content = command.content;
    if (command.type !== undefined) entity.type = command.type;
    if (command.link_url !== undefined) entity.link_url = command.link_url;
    if (command.link_text !== undefined) entity.link_text = command.link_text;
    if (command.is_dismissible !== undefined)
      entity.is_dismissible = command.is_dismissible;
    if (command.is_active !== undefined) entity.is_active = command.is_active;
    if (command.starts_at !== undefined) entity.starts_at = command.starts_at;
    if (command.ends_at !== undefined) entity.ends_at = command.ends_at;

    await this.repository.save(entity);
  }
}
