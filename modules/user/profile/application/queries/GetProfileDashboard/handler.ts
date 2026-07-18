import { ProfileRepository } from '../../../domain/repositories/ProfileRepository';
import { UserId } from '@/modules/core/domain/UserId';
import { GetProfileDashboardOutput, ProfileOutput } from './read-model';
import { UserProfile } from '../../../domain/entities/UserProfile';
// In a real implementation we would inject a SocialRepository and a LibraryRepository 
// but for now we define an interface that the caller provides to orchestrate this.

export interface DashboardDependencies {
    profileRepository: ProfileRepository;
    fetchFollowersCount: (userId: string) => Promise<number>;
    fetchFollowingCount: (userId: string) => Promise<number>;
    fetchFinishedBooks: (userId: string) => Promise<any[]>; // using any[] to avoid strict coupling to Library's internal return types if they change
}

export async function getProfileDashboard(
    deps: DashboardDependencies,
    userIdStr: string
): Promise<GetProfileDashboardOutput> {
    const userId = UserId.create(userIdStr);
    
    // 1. Fetch Profile Aggregate
    const profile = await deps.profileRepository.findByUserId(userId);
    if (!profile) {
        throw new Error('Profile not found');
    }

    // 2. Fetch other bounded context data concurrently
    const [followersCount, followingCount, finishedBooks] = await Promise.all([
        deps.fetchFollowersCount(userId.value),
        deps.fetchFollowingCount(userId.value),
        deps.fetchFinishedBooks(userId.value)
    ]);

    // 3. Map aggregate to pure output model
    const profileOutput: ProfileOutput = {
        id: profile.id,
        displayName: profile.displayName.value,
        avatarUrl: profile.avatarUrl.value,
        biography: profile.biography.value,
        location: profile.location.value
    };

    // 4. Assemble composite dashboard
    return {
        profile: profileOutput,
        followersCount,
        followingCount,
        booksReadCount: finishedBooks.length,
        recentBooks: finishedBooks.slice(0, 3)
    };
}
