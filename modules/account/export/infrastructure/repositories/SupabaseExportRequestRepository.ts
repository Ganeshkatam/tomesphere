import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ExportRequestRepository } from "../../domain/repositories/ExportRequestRepository";
import {
  ExportRequest,
  ExportRequestStatus,
} from "../../domain/entities/ExportRequest";

/**
 * Supabase implementation of ExportRequestRepository.
 */
export class SupabaseExportRequestRepository implements ExportRequestRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async save(request: ExportRequest): Promise<void> {
    const { error } = await this.supabase.from("export_requests" as any).upsert(
      {
        id: request.id,
        user_id: request.userId,
        status: request.status,
        download_url: request.downloadUrl,
        requested_at: request.requestedAt.toISOString(),
        queued_at: request.queuedAt?.toISOString() ?? null,
        completed_at: request.completedAt?.toISOString() ?? null,
        expires_at: request.expiresAt?.toISOString() ?? null,
        error_message: request.errorMessage,
      } as any,
      { onConflict: "id" },
    );

    if (error) {
      throw new Error(`Failed to save export request: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<ExportRequest | null> {
    const { data, error } = await this.supabase
      .from("export_requests" as any)
      .select("*")
      .eq("user_id", userId)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return this.toDomain(data);
  }

  async findActiveRequest(userId: string): Promise<ExportRequest | null> {
    const activeStatuses: ExportRequestStatus[] = [
      "requested",
      "queued",
      "processing",
    ];

    const { data, error } = await this.supabase
      .from("export_requests" as any)
      .select("*")
      .eq("user_id", userId)
      .in("status", activeStatuses)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return this.toDomain(data);
  }

  private toDomain(data: any): ExportRequest {
    return ExportRequest.fromPersistence(data.id, {
      userId: data.user_id,
      status: data.status as ExportRequestStatus,
      downloadUrl: data.download_url,
      requestedAt: new Date(data.requested_at),
      queuedAt: data.queued_at ? new Date(data.queued_at) : null,
      completedAt: data.completed_at ? new Date(data.completed_at) : null,
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
      errorMessage: data.error_message,
    });
  }
}
