import { SupabaseAuthorizationRepository } from "./SupabaseAuthorizationRepository";
import { Permission } from "@/shared/kernel/security/Permission";
import { AuthorizationInfrastructureError } from "../domain/errors/AuthorizationInfrastructureError";

describe("SupabaseAuthorizationRepository", () => {
  let mockSupabase: any;
  let repository: SupabaseAuthorizationRepository;

  beforeEach(() => {
    mockSupabase = {
      rpc: jest.fn(),
    };
    repository = new SupabaseAuthorizationRepository(mockSupabase);
  });

  describe("hasPermission", () => {
    it("should return true when RPC returns true", async () => {
      mockSupabase.rpc.mockResolvedValue({ data: true, error: null });

      const result = await repository.hasPermission("user-1", Permission.ManageUsers);
      expect(result).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith("has_permission", {
        p_user_id: "user-1",
        p_permission: Permission.ManageUsers,
      });
    });

    it("should return false when RPC returns false", async () => {
      mockSupabase.rpc.mockResolvedValue({ data: false, error: null });

      const result = await repository.hasPermission("user-1", Permission.ManageUsers);
      expect(result).toBe(false);
    });

    it("should throw AuthorizationInfrastructureError when RPC errors out", async () => {
      const dbError = { message: "Relation user_roles does not exist", code: "42P01" };
      mockSupabase.rpc.mockResolvedValue({ data: null, error: dbError });

      await expect(
        repository.hasPermission("user-1", Permission.ManageUsers),
      ).rejects.toThrow(AuthorizationInfrastructureError);

      await expect(
        repository.hasPermission("user-1", Permission.ManageUsers),
      ).rejects.toThrow(/Failed to evaluate permission/);
    });
  });

  describe("getUserPermissions", () => {
    it("should map valid string results to canonical Permission enum items", async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ permission: "ManageUsers" }, { permission: "ManageAnnouncements" }],
        error: null,
      });

      const result = await repository.getUserPermissions("user-1");
      expect(result).toEqual([Permission.ManageUsers, Permission.ManageAnnouncements]);
    });

    it("should filter out non-canonical permissions", async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ permission: "ManageUsers" }, { permission: "UnknownFakePerm" }],
        error: null,
      });

      const result = await repository.getUserPermissions("user-1");
      expect(result).toEqual([Permission.ManageUsers]);
    });

    it("should throw AuthorizationInfrastructureError on RPC error", async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { message: "Database connection lost" },
      });

      await expect(repository.getUserPermissions("user-1")).rejects.toThrow(
        AuthorizationInfrastructureError,
      );
    });
  });
});
