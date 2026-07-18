import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getProfileData } from '@/modules/user/profile/actions/profile';
import { redirect } from 'next/navigation';
import ProfileEditScreen from '@/modules/me/presentation/screens/ProfileEditScreen';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getProfileData();
    const profileData = res.success ? res.data : null;

    return (
        <ProfileEditScreen user={user} initialProfile={profileData?.profile || null} />
    );
}
