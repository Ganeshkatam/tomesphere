import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { 
    getCurrentlyReadingAction, 
    getFinishedBooksAction, 
    getWantToReadAction 
} from '@/modules/reading/library/actions/library';
import LibraryClient from '@/modules/reading/library/components/LibraryClient';
import { CurrentlyReadingOutput } from '@/modules/reading/library/application/Outputs';

export default async function LibraryPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const [readingRes, finishedRes, wantRes] = await Promise.all([
        getCurrentlyReadingAction(),
        getFinishedBooksAction(),
        getWantToReadAction()
    ]);

    const initialLibrary: CurrentlyReadingOutput[] = [
        ...(readingRes.success && readingRes.data ? readingRes.data : []),
        ...(finishedRes.success && finishedRes.data ? finishedRes.data : []),
        ...(wantRes.success && wantRes.data ? wantRes.data : []),
    ];

    return <LibraryClient user={user} initialLibrary={initialLibrary} />;
}
