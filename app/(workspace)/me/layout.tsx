import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getProfileData } from '@/modules/user/profile/actions/profile';
import { redirect } from 'next/navigation';
import { TodayLayoutShell } from '@/modules/me/presentation/components/TodayLayoutShell';

import { getProgressDashboard } from '@/modules/user/progress/presentation/actions/progress';

export const dynamic = 'force-dynamic';

export default async function MeLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const [profileRes, progress] = await Promise.all([
        getProfileData(),
        getProgressDashboard()
    ]);
    const profileData = profileRes.success ? profileRes.data : null;

    // Get unread notifications count
    const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

    const profile = profileData?.profile;
    const name = profile?.displayName || user.email?.split('@')[0] || 'Reader';
    const avatarUrl = profile?.avatarUrl || null;
    const createdAt = user.created_at ? new Date(user.created_at).getFullYear() : 2025;
    const streak = progress?.streak.currentDays || 0;
    const booksRead = progress?.goals.yearlyBooksProgress || profileData?.booksReadCount || 0;

    const userSummary = {
        name,
        avatarUrl,
        memberSince: createdAt,
        streak,
        booksRead,
        unreadCount: unreadCount || 0
    };

    return (
        <TodayLayoutShell userSummary={userSummary}>
            {children}
        </TodayLayoutShell>
    );
}
