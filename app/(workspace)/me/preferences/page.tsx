import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getProfileData } from '@/modules/user/profile/actions/profile';
import { redirect } from 'next/navigation';
import PreferencesScreen from '@/modules/me/presentation/screens/PreferencesScreen';

export const dynamic = 'force-dynamic';

export default async function PreferencesPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getProfileData();
    const profileData = res.success ? res.data : null;

    return (
        <PreferencesScreen initialProfile={profileData?.profile || null} />
    );
}
