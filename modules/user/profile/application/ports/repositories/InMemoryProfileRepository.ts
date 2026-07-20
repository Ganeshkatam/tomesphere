import { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import { UserProfile } from "../../../domain/entities/UserProfile";
import { UserId } from "@/shared/kernel/UserId";

export class InMemoryProfileRepository implements ProfileRepository {
  private readonly profiles: Map<string, UserProfile> = new Map();

  async findByUserId(userId: UserId): Promise<UserProfile | null> {
    return this.profiles.get(userId.value) || null;
  }

  async save(profile: UserProfile): Promise<void> {
    this.profiles.set(profile.userId.value, profile);
    profile.pullDomainEvents(); // Clear events just like an infrastructure commit would
  }

  async setupInitialProfile(
    userId: UserId,
    name: string,
    favoriteGenres: string[],
    readingGoal: any,
  ): Promise<void> {
    // In-memory implementation of the setup RPC
    const profile = this.profiles.get(userId.value);
    if (profile) {
      profile.updateIdentity({
        displayName: name,
        biography: profile.biography.value,
        location: profile.location.value,
      });
      this.profiles.set(userId.value, profile);
    }
  }
}
