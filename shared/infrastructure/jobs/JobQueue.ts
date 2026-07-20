import { JobRepository } from "./JobRepository";
import { Job, JobType } from "./types";

export interface IJobQueue {
  enqueue<T>(jobType: JobType, payload: T, scheduledAt?: Date): Promise<Job<T>>;
}

export class JobQueue implements IJobQueue {
  constructor(private readonly jobRepository: JobRepository) {}

  async enqueue<T>(
    jobType: JobType,
    payload: T,
    scheduledAt: Date = new Date(),
  ): Promise<Job<T>> {
    return this.jobRepository.create({
      type: jobType,
      payload,
      scheduledAt,
    });
  }
}
