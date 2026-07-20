import { JobRepository } from "./JobRepository";
import { JobHandlerRegistry } from "./JobHandlerRegistry";

export class JobDispatcher {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly registry: JobHandlerRegistry,
  ) {}

  async dispatch(jobId: string, workerId: string = "default"): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      console.warn(`[JobDispatcher] Job not found: ${jobId}`);
      return;
    }

    if (job.status !== "pending" && job.status !== "failed") {
      console.warn(`[JobDispatcher] Job is not in a dispatchable state: ${job.status}`);
      return;
    }

    const handler = this.registry.get(job.type);
    if (!handler) {
      const err = new Error(`No handler registered for job type: ${job.type}`);
      await this.jobRepository.markFailed(jobId, err, workerId);
      return;
    }

    try {
      await this.jobRepository.updateStatus(jobId, "processing", workerId);
      await handler.handle(job);
      await this.jobRepository.complete(jobId);
    } catch (error: any) {
      await this.jobRepository.markFailed(jobId, error, workerId, error.stack);
    }
  }
}
