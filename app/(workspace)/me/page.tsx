import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getProfileData } from '@/modules/user/profile/actions/profile';
import { getDashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';
import { getUserNotes } from '@/modules/learning/notes/actions/notes';
import { redirect } from 'next/navigation';
import TodayScreen from '@/modules/me/presentation/screens/TodayScreen';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const [profileRes, dashboardRes, notesRes] = await Promise.all([
        getProfileData(),
        getDashboardData(),
        getUserNotes()
    ]);

    const profileData = profileRes.success ? profileRes.data : null;
    const dashboardData = dashboardRes.success && dashboardRes.data ? dashboardRes.data : {
        likedBooks: [],
        ratedBooks: [],
        comments: [],
        readingList: [],
        dailyStats: []
    };
    const notesData = notesRes.success && notesRes.data ? notesRes.data : [];

    return (
        <TodayScreen user={user} profileData={profileData} dashboardData={dashboardData} notes={notesData} />
    );
}
