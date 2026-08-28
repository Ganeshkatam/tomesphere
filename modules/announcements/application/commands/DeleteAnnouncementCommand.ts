import { AnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";
import { PermissionService } from "@/modules/authorization/application/PermissionService";
import { Permission } from "@/shared/kernel/security/Permission";

export interface DeleteAnnouncementCommand {
  callerId: string;
  id: string;
}

export class DeleteAnnouncementHandler {
  constructor(
    private readonly repository: AnnouncementRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(command: DeleteAnnouncementCommand): Promise<void> {
    await this.permissionService.assertPermission(
      command.callerId,
      Permission.ManageAnnouncements,
    );

    await this.repository.delete(command.id);
  }
}
