import { SupabasePlatformReportRepository } from "./SupabasePlatformReportRepository";
import { PlatformReport } from "../../domain/entities/PlatformReport";

describe("SupabasePlatformReportRepository", () => {
  let mockSupabase: any;
  let repository: SupabasePlatformReportRepository;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
    };

    repository = new SupabasePlatformReportRepository(mockSupabase);
  });

  it("should save platform report with mapped fields", async () => {
    const report = PlatformReport.create({
      id: "report-1",
      type: "BUG",
      title: "Broken link",
      description: "Search results link broken on page 2",
      email: "reporter@example.com",
      userId: "user-123",
    });

    await repository.save(report);

    expect(mockSupabase.from).toHaveBeenCalledWith("platform_reports");
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "report-1",
        type: "BUG",
        title: "Broken link",
        description: "Search results link broken on page 2",
        email: "reporter@example.com",
        user_id: "user-123",
        status: "PENDING",
      }),
    );
  });

  it("should throw error when database insertion fails", async () => {
    mockSupabase.insert.mockResolvedValue({
      error: { message: "Database connection failed" },
    });

    const report = PlatformReport.create({
      id: "report-err",
      type: "ABUSE",
      title: "Inappropriate review",
      description: "Spam commentary on book 44",
    });

    await expect(repository.save(report)).rejects.toThrow(
      "Failed to save platform report: Database connection failed",
    );
  });
});
