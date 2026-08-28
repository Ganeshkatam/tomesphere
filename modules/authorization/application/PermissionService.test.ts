import { PermissionService, UnauthorizedError } from "./PermissionService";
import { AuthorizationRepository } from "../domain/AuthorizationRepository";
import { Permission } from "@/shared/kernel/security/Permission";
import { AuthorizationInfrastructureError } from "../domain/errors/AuthorizationInfrastructureError";

describe("PermissionService", () => {
  let mockRepo: jest.Mocked<AuthorizationRepository>;
  let service: PermissionService;

  beforeEach(() => {
    mockRepo = {
      hasPermission: jest.fn(),
      getUserPermissions: jest.fn(),
    };
    service = new PermissionService(mockRepo);
  });

  describe("assertPermission", () => {
    it("should resolve successfully when the user holds the required permission", async () => {
      mockRepo.hasPermission.mockResolvedValue(true);

      await expect(
        service.assertPermission("user-admin", Permission.ManageAnnouncements),
      ).resolves.not.toThrow();

      expect(mockRepo.hasPermission).toHaveBeenCalledWith(
        "user-admin",
        Permission.ManageAnnouncements,
      );
    });

    it("should throw UnauthorizedError when the user lacks the permission", async () => {
      mockRepo.hasPermission.mockResolvedValue(false);

      await expect(
        service.assertPermission("user-regular", Permission.ManageAnnouncements),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        service.assertPermission("user-regular", Permission.ManageAnnouncements),
      ).rejects.toThrow(
        "User does not have the required permission: ManageAnnouncements",
      );
    });

    it("should propagate AuthorizationInfrastructureError without masking it as an authorization rejection", async () => {
      const infraError = new AuthorizationInfrastructureError("Connection timeout");
      mockRepo.hasPermission.mockRejectedValue(infraError);

      await expect(
        service.assertPermission("user-1", Permission.ManageBooks),
      ).rejects.toThrow(AuthorizationInfrastructureError);

      await expect(
        service.assertPermission("user-1", Permission.ManageBooks),
      ).rejects.toThrow("Authorization infrastructure failure: Connection timeout");
    });
  });

  describe("checkPermission", () => {
    it("should return true when user has permission", async () => {
      mockRepo.hasPermission.mockResolvedValue(true);
      const result = await service.checkPermission("user-1", Permission.ViewAuditLogs);
      expect(result).toBe(true);
    });

    it("should return false when user lacks permission", async () => {
      mockRepo.hasPermission.mockResolvedValue(false);
      const result = await service.checkPermission("user-1", Permission.ViewAuditLogs);
      expect(result).toBe(false);
    });
  });
});
