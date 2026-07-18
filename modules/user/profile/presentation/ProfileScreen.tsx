import ProfileClient from '@/modules/user/profile/presentation/components/ProfileClient';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getProfileData } from '@/modules/user/profile/actions/profile';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getProfileData();
    const profileData = res.success ? res.data : null;

    const booksReadCount = profileData?.booksReadCount || 0;
    const engagementScore = 0; // TODO: Move to Stats/Progress domain
    const totalPoints = 0; // TODO: Move to Stats/Progress domain
    const readingStreak = 0; // TODO: Move to Stats/Progress domain
    const totalReadingSeconds = 0; // TODO: Move to Stats/Progress domain

    const initialStats = {
        booksRead: booksReadCount,
        pagesRead: booksReadCount * 312, // Approximation based on average book length
        readingStreak: readingStreak,
        totalHours: Math.floor(totalReadingSeconds / 3600), // Exact tracked time in hours
        achievements: Math.floor(engagementScore / 50), // 1 achievement per 50 engagement points
        level: Math.floor(totalPoints / 1000) + 1 // 1 level per 1000 points
    };

    return (
        <ProfileClient 
            user={user} 
            initialProfile={profileData?.profile || null}
            initialStats={initialStats}
            initialFollowersCount={profileData?.followersCount || 0}
            initialFollowingCount={profileData?.followingCount || 0}
            initialRecentBooks={profileData?.recentBooks || []}
        />
    );
}
