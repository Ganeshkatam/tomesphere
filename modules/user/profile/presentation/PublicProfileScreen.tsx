import PublicProfileClient from '@/modules/user/profile/presentation/components/PublicProfileClient';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getPublicProfileData } from '@/modules/user/profile/actions/profile';
import { notFound } from 'next/navigation';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const res = await getPublicProfileData(id);
    if (!res.success || !res.data?.profile) {
        notFound();
    }

    return (
        <PublicProfileClient 
            id={id}
            currentUser={user}
            initialProfileData={res.data.profile}
            initialFollowersCount={res.data.followersCount}
            initialFollowingCount={res.data.followingCount}
            initialIsFollowing={res.data.isFollowing}
            initialBooksReadCount={res.data.booksReadCount}
        />
    );
}
