import { RequestExportCommand } from "./index";
import { ExportRequestRepository } from "../../../domain/repositories/ExportRequestRepository";
import { ExportRequest } from "../../../domain/entities/ExportRequest";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

/**
 * Request Export Handler
 *
 * Flow:
 *   1. Check for existing active export
 *   2. Create ExportRequest aggregate
 *   3. Persist to database
 *   4. Emit account.export.requested to outbox for async processing
 *
 * The actual export generation happens in a background worker
 * that processes the outbox event.
 */
export class RequestExportHandler {
  constructor(
    private readonly exportRequestRepository: ExportRequestRepository,
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async execute(command: RequestExportCommand): Promise<void> {
    // 1. Guard: prevent duplicate active requests
    const existing = await this.exportRequestRepository.findActiveRequest(
      command.userId,
    );
    if (existing) {
      throw new Error(
        "An export is already in progress. Please wait for it to complete.",
      );
    }

    // 2. Create export request aggregate
    const request = ExportRequest.create(command.userId);

    // 3. Persist
    await this.exportRequestRepository.save(request);

    // 4. Emit to outbox for async processing
    await emitOutboxEvent(
      this.supabase,
      "account.export.requested",
      {
        userId: command.userId,
        exportRequestId: request.id,
      },
      "export_request",
      request.id,
    );
  }
}
