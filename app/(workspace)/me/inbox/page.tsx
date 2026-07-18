import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { redirect } from 'next/navigation';
import InboxScreen from '@/modules/me/presentation/screens/InboxScreen';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <InboxScreen initialNotifications={notifications || []} user={user} />
    );
}
