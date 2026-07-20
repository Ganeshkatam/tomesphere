export enum JobType {
  SEARCH_INDEX = "SEARCH_INDEX",
  EXPORT_DATA = "EXPORT_DATA",
  SEND_EMAIL = "SEND_EMAIL",
  BUILD_STATISTICS = "BUILD_STATISTICS",
  REFRESH_FEATURED = "REFRESH_FEATURED",
  PROJECTION_REBUILD = "PROJECTION_REBUILD",
  MV_REFRESH = "MV_REFRESH",
}

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job<TPayload = unknown> {
  id: string;
  type: JobType;
  payload: TPayload;
  status: JobStatus;
  attempts: number;
  lastError: string | null;
  scheduledAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
