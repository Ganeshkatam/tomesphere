import { Job } from "./types";

export interface JobHandler<TPayload = unknown> {
  handle(job: Job<TPayload>): Promise<void>;
}
