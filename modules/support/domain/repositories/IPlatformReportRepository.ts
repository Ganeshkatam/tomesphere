import { PlatformReport } from "../entities/PlatformReport";

export interface IPlatformReportRepository {
  save(report: PlatformReport): Promise<void>;
}
