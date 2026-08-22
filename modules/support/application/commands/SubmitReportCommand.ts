import { IPlatformReportRepository } from "../../domain/repositories/IPlatformReportRepository";
import { PlatformReport, ReportType } from "../../domain/entities/PlatformReport";

export interface SubmitReportDto {
  type: string;
  title: string;
  description: string;
  email?: string | null;
  userId?: string | null;
}

export class SubmitReportCommand {
  constructor(private readonly repository: IPlatformReportRepository) {}

  public async execute(dto: SubmitReportDto): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // 1. Aggressive Validation
      const validTypes: ReportType[] = ["BUG", "ABUSE", "SECURITY"];
      
      if (!dto.type || !validTypes.includes(dto.type as ReportType)) {
        return { success: false, error: "Invalid report type." };
      }
      
      if (!dto.title || dto.title.trim().length === 0 || dto.title.length > 200) {
        return { success: false, error: "Title must be between 1 and 200 characters." };
      }
      
      if (!dto.description || dto.description.trim().length === 0 || dto.description.length > 5000) {
        return { success: false, error: "Description must be between 1 and 5000 characters." };
      }

      let normalizedEmail = dto.email?.trim() || null;
      if (normalizedEmail) {
        if (normalizedEmail.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
          return { success: false, error: "Invalid email format." };
        }
      }

      // 2. Map to Domain Entity
      const report = PlatformReport.create({
        id: crypto.randomUUID(),
        type: dto.type as ReportType,
        title: dto.title.trim(),
        description: dto.description.trim(),
        email: normalizedEmail,
        userId: dto.userId || null,
      });

      // 3. Persist
      await this.repository.save(report);

      return { success: true, id: report.id };
    } catch (error: any) {
      console.error("[SubmitReportCommand] Error:", error);
      return { success: false, error: "An unexpected error occurred while saving the report." };
    }
  }
}
