import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getDashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';
import DashboardClient from '@/modules/progress/analytics/components/DashboardClient';

export default async function DashboardPage() {
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

    return <DashboardClient user={user} initialData={dashboardData} />;
}
