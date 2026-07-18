import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getExploreData } from '@/modules/reading/books/actions/books';
import ExploreClient from '@/modules/reading/books/components/ExploreClient';

export default async function ExplorePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const res = await getExploreData();
    const exploreData = res.success && res.data ? res.data : { books: [], likes: [], ratings: [] };

    return <ExploreClient user={user} initialData={exploreData} />;
}
