import { ProfileRepository } from '../ProfileRepository';
import { UserProfile } from '../../entities/UserProfile';
import { UserId } from '@/modules/core/domain/UserId';

export class InMemoryProfileRepository implements ProfileRepository {
    private readonly profiles: Map<string, UserProfile> = new Map();

    async findByUserId(userId: UserId): Promise<UserProfile | null> {
        return this.profiles.get(userId.value) || null;
    }

    async save(profile: UserProfile): Promise<void> {
        this.profiles.set(profile.userId.value, profile);
        profile.pullDomainEvents(); // Clear events just like an infrastructure commit would
    }
}
