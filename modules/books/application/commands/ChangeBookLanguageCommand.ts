// Shell for ChangeBookLanguageCommand - To be implemented
export interface ChangeBookLanguageCommand {
  id: string;
  language: string;
}

export class ChangeBookLanguageHandler {
  async execute(command: ChangeBookLanguageCommand): Promise<void> {
    throw new Error("Not implemented");
  }
}
