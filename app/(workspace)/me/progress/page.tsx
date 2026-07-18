import { getProgressDashboard } from '@/modules/user/progress/presentation/actions/progress';
import { getDashboardData } from '@/modules/me/application/GetTodayOverview/actions/dashboard';
import { redirect } from 'next/navigation';
import ProgressDashboardScreen from '@/modules/user/progress/presentation/components/ProgressDashboardScreen';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
    const [progress, dashboardRes] = await Promise.all([
        getProgressDashboard(),
        getDashboardData() // We keep this for the dailyStats chart for now
    ]);

    if (!progress) {
        redirect('/login');
    }

    const dashboardData = dashboardRes.success && dashboardRes.data ? dashboardRes.data : { dailyStats: [] };

    return (
        <ProgressDashboardScreen progress={progress} dailyStats={dashboardData.dailyStats} />
    );
}
