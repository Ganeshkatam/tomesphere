export interface ProjectionHandler {
  buildAndUpsert(entityId: string): Promise<void>;
  remove(entityId: string): Promise<void>;
}

export class ProjectionRegistry {
  private indexers = new Map<string, ProjectionHandler>();

  register(name: string, handler: ProjectionHandler): void {
    this.indexers.set(name, handler);
  }

  get(name: string): ProjectionHandler | undefined {
    return this.indexers.get(name);
  }

  async rebuildAll(entityId: string): Promise<void> {
    const promises = Array.from(this.indexers.values()).map(handler =>
      handler.buildAndUpsert(entityId)
    );
    await Promise.all(promises);
  }
}
