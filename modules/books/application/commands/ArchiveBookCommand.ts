// Shell for ArchiveBookCommand - To be implemented
export interface ArchiveBookCommand {
  id: string;
}

export class ArchiveBookHandler {
  async execute(command: ArchiveBookCommand): Promise<void> {
    throw new Error("Not implemented");
  }
}
