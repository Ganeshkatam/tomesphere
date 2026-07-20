import { PreferencesRepository } from "../../../domain/repositories/PreferencesRepository";
import { UpdatePreferencesCommand } from "./index";
import { UserId } from "@/shared/kernel/UserId";

export class UpdatePreferencesHandler {
  constructor(private readonly preferencesRepository: PreferencesRepository) {}

  async execute(command: UpdatePreferencesCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    let preferences = await this.preferencesRepository.findByUserId(userId);

    if (!preferences) {
      // If preferences don't exist yet, we initialize them before updating
      await this.preferencesRepository.setupInitialPreferences(userId);
      preferences = await this.preferencesRepository.findByUserId(userId);
      if (!preferences) throw new Error("Failed to initialize preferences.");
    }

    if (command.appearance) preferences.updateAppearance(command.appearance);
    if (command.reader) preferences.updateReader(command.reader);
    if (command.notifications)
      preferences.updateNotifications(command.notifications);

    await this.preferencesRepository.save(preferences);
  }
}
