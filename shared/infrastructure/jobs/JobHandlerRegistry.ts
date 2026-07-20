import { JobType } from "./types";
import { JobHandler } from "./JobHandler";

export class JobHandlerRegistry {
  private handlers = new Map<JobType, JobHandler<any>>();

  register<T>(type: JobType, handler: JobHandler<T>): void {
    if (this.handlers.has(type)) {
      throw new Error(`Handler already registered for job type: ${type}`);
    }
    this.handlers.set(type, handler);
  }

  get<T>(type: JobType): JobHandler<T> | undefined {
    return this.handlers.get(type) as JobHandler<T> | undefined;
  }
}
