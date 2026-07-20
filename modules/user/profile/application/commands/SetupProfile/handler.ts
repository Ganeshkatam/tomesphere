import { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import { UserId } from "@/shared/kernel/UserId";
import { SetupProfileCommand } from "./command";

export class SetupProfileHandler {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: SetupProfileCommand): Promise<void> {
    const userId = UserId.create(command.userId);

    await this.profileRepository.setupInitialProfile(
      userId,
      command.name,
      command.favoriteGenres,
      command.readingGoal,
    );
  }
}
