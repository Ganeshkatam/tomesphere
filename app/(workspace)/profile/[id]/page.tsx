import PublicProfileScreen from '@/modules/user/profile/presentation/PublicProfileScreen';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return <PublicProfileScreen params={params} />;
}
