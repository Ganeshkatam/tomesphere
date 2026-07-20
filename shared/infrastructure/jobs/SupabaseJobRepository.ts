import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { JobRepository } from "./JobRepository";
import { Job, JobType, JobStatus } from "./types";

export class SupabaseJobRepository implements JobRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create<T>(
    job: Omit<
      Job<T>,
      | "id"
      | "status"
      | "attempts"
      | "lastError"
      | "startedAt"
      | "completedAt"
      | "createdAt"
      | "updatedAt"
    >,
  ): Promise<Job<T>> {
    const { data, error } = await this.supabase
      .from("job_queue")
      .insert({
        job_type: job.type,
        payload: job.payload as any,
        scheduled_at: job.scheduledAt.toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create job: ${error?.message}`);
    }

    return this.mapToDomain(data);
  }

  async findById<T>(id: string): Promise<Job<T> | null> {
    const { data, error } = await this.supabase
      .from("job_queue")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    workerId?: string,
  ): Promise<void> {
    const updates: any = { status };

    if (status === "processing") {
      updates.started_at = new Date().toISOString();
      if (workerId) {
        // Storing worker info in payload or keeping it light for now
      }
    }

    const { error } = await this.supabase
      .from("job_queue")
      .update(updates)
      .eq("id", id);

    if (error) throw new Error(`Failed to update status: ${error.message}`);
  }

  async markFailed(
    id: string,
    err: Error,
    workerId: string,
    stackTrace?: string,
  ): Promise<void> {
    // 1. Move to job_failures for observability
    const { data: jobData } = await this.supabase
      .from("job_queue")
      .select("*")
      .eq("id", id)
      .single();

    if (jobData) {
      await this.supabase.from("job_failures").insert({
        job_type: jobData.job_type,
        payload: jobData.payload,
        error: err.message,
        stack_trace: stackTrace || err.stack || null,
        worker: workerId,
        retry_count: jobData.attempts,
      });
    }

    // 2. Mark queue item as failed and increment attempts
    const { error } = await this.supabase.rpc(
      "job_queue_mark_failed" as any, // Needs RPC or raw update if we want atomic increments
    );

    // For V1, simple update:
    await this.supabase
      .from("job_queue")
      .update({
        status: "failed",
        last_error: err.message,
        attempts: (jobData?.attempts || 0) + 1,
      })
      .eq("id", id);
  }

  async retry(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("job_queue")
      .update({
        status: "pending",
        last_error: null,
      })
      .eq("id", id);

    if (error) throw new Error(`Failed to retry job: ${error.message}`);
  }

  async complete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("job_queue")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(`Failed to complete job: ${error.message}`);
  }

  private mapToDomain<T>(row: any): Job<T> {
    return {
      id: row.id,
      type: row.job_type as JobType,
      payload: row.payload as T,
      status: row.status as JobStatus,
      attempts: row.attempts,
      lastError: row.last_error,
      scheduledAt: new Date(row.scheduled_at),
      startedAt: row.started_at ? new Date(row.started_at) : null,
      completedAt: row.completed_at ? new Date(row.completed_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
