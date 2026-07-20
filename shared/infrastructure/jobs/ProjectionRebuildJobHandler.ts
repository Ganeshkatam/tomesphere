import { JobHandler } from "./JobHandler";
import { Job } from "./types";
import { ProjectionRegistry } from "../projections/ProjectionRegistry";

export interface ProjectionRebuildPayload {
  entityId: string;
  projectionName?: string; // If omitted, rebuild all
}

export class ProjectionRebuildJobHandler implements JobHandler<ProjectionRebuildPayload> {
  constructor(private readonly registry: ProjectionRegistry) {}

  async handle(job: Job<ProjectionRebuildPayload>): Promise<void> {
    const { entityId, projectionName } = job.payload;

    if (projectionName) {
      const handler = this.registry.get(projectionName);
      if (!handler) {
        throw new Error(`No projection handler found for ${projectionName}`);
      }
      await handler.buildAndUpsert(entityId);
    } else {
      // Rebuild across all registered projections
      await this.registry.rebuildAll(entityId);
    }
  }
}
