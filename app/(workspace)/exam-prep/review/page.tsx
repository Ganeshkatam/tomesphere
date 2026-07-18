import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getDueReviewItems } from '@/modules/learning/foundation/actions/study-plan';
import ReviewClient from '@/modules/planner/academic/components/ReviewClient';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getDueReviewItems();
    const items = res.success && res.data ? res.data : [];

    return <ReviewClient initialItems={items} />;
}
