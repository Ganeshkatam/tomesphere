import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getDashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';
import { redirect } from 'next/navigation';
import ReadingScreen from '@/modules/me/presentation/screens/ReadingScreen';

export const dynamic = 'force-dynamic';

export default async function ReadingPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getDashboardData();
    const dashboardData = res.success && res.data ? res.data : {
        likedBooks: [],
        ratedBooks: [],
        comments: [],
        readingList: [],
        dailyStats: []
    };

    return (
        <ReadingScreen readingList={dashboardData.readingList} />
    );
}
