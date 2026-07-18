import { CurrentlyReadingOutput } from '@/modules/shared/core/types/LibraryReadModels';

export interface ProfileOutput {
    readonly id: string;
    readonly displayName: string;
    readonly avatarUrl: string;
    readonly biography: string;
    readonly location: string;
}

export interface GetProfileDashboardOutput {
    readonly profile: ProfileOutput;
    readonly followersCount: number;
    readonly followingCount: number;
    readonly booksReadCount: number;
    readonly recentBooks: CurrentlyReadingOutput[];
}
