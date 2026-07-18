import { ProfileRepository } from '../../../domain/repositories/ProfileRepository';
import { UserId } from '@/modules/core/domain/UserId';
import { UpdateProfileOutput } from './command';

export interface UpdateProfileInput {
    readonly userId: string;
    readonly displayName?: string;
    readonly biography?: string;
    readonly location?: string;
    readonly avatarUrl?: string;
}

export async function updateProfile(
    repository: ProfileRepository,
    input: UpdateProfileInput
): Promise<UpdateProfileOutput> {
    const userId = UserId.create(input.userId);
    const profile = await repository.findByUserId(userId);

    if (!profile) {
        throw new Error('Profile not found');
    }

    // Update identity if fields are provided
    if (input.displayName !== undefined || input.biography !== undefined || input.location !== undefined) {
        profile.updateIdentity({
            displayName: input.displayName ?? profile.displayName.value,
            biography: input.biography ?? profile.biography.value,
            location: input.location ?? profile.location.value
        });
    }

    // Update avatar if provided
    if (input.avatarUrl !== undefined) {
        profile.changeAvatar(input.avatarUrl);
    }

    await repository.save(profile);

    return {
        output: {
            id: profile.id,
            displayName: profile.displayName.value,
            avatarUrl: profile.avatarUrl.value,
            biography: profile.biography.value,
            location: profile.location.value
        },
        events: profile.pullDomainEvents()
    };
}
