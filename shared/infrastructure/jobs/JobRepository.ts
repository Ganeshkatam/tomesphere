import { Job } from "./types";

export interface JobRepository {
  create<T>(job: Omit<Job<T>, "id" | "status" | "attempts" | "lastError" | "startedAt" | "completedAt" | "createdAt" | "updatedAt">): Promise<Job<T>>;
  findById<T>(id: string): Promise<Job<T> | null>;
  updateStatus(id: string, status: Job["status"], workerId?: string): Promise<void>;
  markFailed(id: string, error: Error, workerId: string, stackTrace?: string): Promise<void>;
  retry(id: string): Promise<void>;
  complete(id: string): Promise<void>;
}
