import { CreateAnnouncementHandler } from "./CreateAnnouncementCommand";
import { UpdateAnnouncementHandler } from "./UpdateAnnouncementCommand";
import { DeleteAnnouncementHandler } from "./DeleteAnnouncementCommand";
import { AnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";
import { PermissionService, UnauthorizedError } from "@/shared/kernel/security/PermissionService";
import { Permission } from "@/shared/kernel/security/Permission";

describe("Announcement Command Handlers Authorization", () => {
  let mockRepo: jest.Mocked<AnnouncementRepository>;
  let mockPermissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockPermissionService = {
      assertPermission: jest.fn(),
      checkPermission: jest.fn(),
    } as any;
  });

  describe("CreateAnnouncementHandler", () => {
    it("should create announcement when caller holds ManageAnnouncements permission", async () => {
      mockPermissionService.assertPermission.mockResolvedValue();
      const handler = new CreateAnnouncementHandler(mockRepo, mockPermissionService);

      const id = await handler.execute({
        callerId: "admin-user",
        title: "System Maintenance",
        content: "Maintenance scheduled for tonight.",
        type: "maintenance",
      });

      expect(id).toBeDefined();
      expect(mockPermissionService.assertPermission).toHaveBeenCalledWith(
        "admin-user",
        Permission.ManageAnnouncements,
      );
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedError when caller lacks ManageAnnouncements permission", async () => {
      mockPermissionService.assertPermission.mockRejectedValue(
        new UnauthorizedError(Permission.ManageAnnouncements),
      );
      const handler = new CreateAnnouncementHandler(mockRepo, mockPermissionService);

      await expect(
        handler.execute({
          callerId: "regular-user",
          title: "Fake News",
          content: "Spam content",
          type: "info",
        }),
      ).rejects.toThrow(UnauthorizedError);

      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("UpdateAnnouncementHandler", () => {
    it("should update announcement when caller is authorized", async () => {
      mockPermissionService.assertPermission.mockResolvedValue();
      mockRepo.findById.mockResolvedValue({
        id: "ann-1",
        title: "Old Title",
        content: "Old Content",
        type: "info",
        is_dismissible: true,
        is_active: true,
        starts_at: new Date().toISOString(),
        ends_at: null,
      } as any);

      const handler = new UpdateAnnouncementHandler(mockRepo, mockPermissionService);
      await handler.execute({
        callerId: "admin-user",
        id: "ann-1",
        title: "New Title",
      });

      expect(mockPermissionService.assertPermission).toHaveBeenCalledWith(
        "admin-user",
        Permission.ManageAnnouncements,
      );
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: "ann-1", title: "New Title" }),
      );
    });

    it("should throw UnauthorizedError when unauthorized caller tries to update", async () => {
      mockPermissionService.assertPermission.mockRejectedValue(
        new UnauthorizedError(Permission.ManageAnnouncements),
      );
      const handler = new UpdateAnnouncementHandler(mockRepo, mockPermissionService);

      await expect(
        handler.execute({
          callerId: "regular-user",
          id: "ann-1",
          title: "Hacked",
        }),
      ).rejects.toThrow(UnauthorizedError);

      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("DeleteAnnouncementHandler", () => {
    it("should delete announcement when caller is authorized", async () => {
      mockPermissionService.assertPermission.mockResolvedValue();
      const handler = new DeleteAnnouncementHandler(mockRepo, mockPermissionService);

      await handler.execute({
        callerId: "admin-user",
        id: "ann-1",
      });

      expect(mockPermissionService.assertPermission).toHaveBeenCalledWith(
        "admin-user",
        Permission.ManageAnnouncements,
      );
      expect(mockRepo.delete).toHaveBeenCalledWith("ann-1");
    });

    it("should throw UnauthorizedError when unauthorized caller tries to delete", async () => {
      mockPermissionService.assertPermission.mockRejectedValue(
        new UnauthorizedError(Permission.ManageAnnouncements),
      );
      const handler = new DeleteAnnouncementHandler(mockRepo, mockPermissionService);

      await expect(
        handler.execute({
          callerId: "regular-user",
          id: "ann-1",
        }),
      ).rejects.toThrow(UnauthorizedError);

      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
