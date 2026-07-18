import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getUserNotes } from '@/modules/learning/notes/actions/notes';
import { redirect } from 'next/navigation';
import NotesClient from '@/modules/learning/notes/components/NotesClient';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const res = await getUserNotes();
    const notes = res.success && res.data ? res.data : [];

    return (
        <NotesClient initialNotes={notes} isNested={true} />
    );
}
