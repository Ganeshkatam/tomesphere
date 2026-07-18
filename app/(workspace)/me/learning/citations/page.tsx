import { getCitations } from '@/modules/learning/citations/actions/citations';
import { CitationsClient } from '@/modules/learning/citations/components/CitationsClient';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';

export const dynamic = 'force-dynamic';

export default async function CitationsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getCitations();
    const initialHistory = res.success ? res.data : [];

    return (
        <CitationsClient initialHistory={initialHistory} isNested={true} />
    );
}
