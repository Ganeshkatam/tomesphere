import HomeClient from '@/modules/reading/home/components/HomeClient';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getBooks, getPersonalizedDashboard } from '@/modules/reading/books/actions/books';
import { getUserNotes } from '@/modules/learning/notes/actions/notes';
import { redirect } from 'next/navigation';

export default async function HomePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch initial data concurrently
    const [initialBooksRes, dashboardDataRes, notesRes] = await Promise.all([
        getBooks(50),
        user ? getPersonalizedDashboard() : Promise.resolve({ success: true, data: null }),
        user ? getUserNotes() : Promise.resolve({ success: true, data: [] })
    ]);

    const initialBooks = initialBooksRes.success ? (initialBooksRes.data.items as any[]) : [];
    const dashboardData = dashboardDataRes.success ? dashboardDataRes.data : null;
    const initialNotes = notesRes.success && notesRes.data ? notesRes.data : [];

    // Query bookmarks count and latest bookmark
    let bookmarksCount = 0;
    let latestHighlight = null;
    if (user) {
        const bookmarksCountRes = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
        bookmarksCount = bookmarksCountRes.count || 0;

        const latestBookmarkRes = await supabase
            .from('bookmarks')
            .select('*, books(title, author)')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        latestHighlight = latestBookmarkRes.data || null;
    }

    // Add extra info to dashboardData
    if (dashboardData) {
        dashboardData.notes = initialNotes;
        dashboardData.bookmarksCount = bookmarksCount;
        dashboardData.latestHighlight = latestHighlight;
    }

    return (
        <HomeClient 
            user={user}
            initialBooks={initialBooks}
            dashboardData={dashboardData}
        />
    );
}
