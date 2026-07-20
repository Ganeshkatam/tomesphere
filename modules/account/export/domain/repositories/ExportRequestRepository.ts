import { ExportRequest } from "../entities/ExportRequest";

/**
 * Export Request Repository Port
 *
 * findActiveRequest() covers all non-terminal states:
 * requested, queued, processing.
 */
export interface ExportRequestRepository {
  save(request: ExportRequest): Promise<void>;
  findByUserId(userId: string): Promise<ExportRequest | null>;
  findActiveRequest(userId: string): Promise<ExportRequest | null>;
}
