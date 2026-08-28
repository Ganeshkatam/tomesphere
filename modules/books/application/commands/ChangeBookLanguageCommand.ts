// Shell for ChangeBookLanguageCommand - To be implemented
export interface ChangeBookLanguageCommand {
  id: string;
  language: string;
}

export class ChangeBookLanguageHandler {
  async execute(command: ChangeBookLanguageCommand): Promise<void> {
    console.warn("[Deferred] ChangeBookLanguageCommand is not yet implemented. This boundary is reserved for future catalog management.");
  }
}
