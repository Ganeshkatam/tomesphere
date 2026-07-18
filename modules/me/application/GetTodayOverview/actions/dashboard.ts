'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';
import type { Book } from '@/modules/shared/core/database/client';
import { getAllLibraryBooksAction } from '@/modules/reading/library/actions/library';
import { CurrentlyReadingOutput } from '@/modules/shared/core/types/LibraryReadModels';

export interface DashboardData {
    likedBooks: Book[];
    ratedBooks: Array<{ book: Book; rating: number }>;
    comments: Array<{ book: Book; content: string; created_at: string }>;
    readingList: CurrentlyReadingOutput[];
    dailyStats: Array<{ date: string; reading_time_minutes: number; pages_read: number; books_completed: number }>;
}

export async function getDashboardData(): Promise<ActionResult<DashboardData>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Fetch all data concurrently
        const [likesRes, ratingsRes, commentsRes, statsRes] = await Promise.all([
            supabase.from('book_likes').select('book_id, books(*)').eq('user_id', user.id),
            supabase.from('ratings').select('book_id, rating, books(*)').eq('user_id', user.id).order('updated_at', { ascending: false }),
            supabase.from('book_comments').select('book_id, content, created_at, books(*)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
            supabase.from('user_daily_stats').select('date, reading_time_minutes, pages_read, books_completed').eq('user_id', user.id).order('date', { ascending: true }).limit(30)
        ]);

        const libraryRes = await getAllLibraryBooksAction();

        const likedBooks = (likesRes.data?.map((l: { books: unknown }) => l.books).filter(Boolean) || []) as Book[];
        
        const ratedBooks = (ratingsRes.data?.map((r: { books: unknown; rating: number }) => ({
            book: r.books as unknown as Book,
            rating: r.rating,
        })).filter(r => r.book) || []);

        const comments = (commentsRes.data?.map((c: { books: unknown; content: string; created_at: string }) => ({
            book: c.books as unknown as Book,
            content: c.content,
            created_at: c.created_at,
        })).filter(c => c.book) || []);

        const readingList = libraryRes.success && libraryRes.data ? libraryRes.data : [];

        const dailyStats = statsRes.data || [];

        return {
            success: true,
            data: {
                likedBooks,
                ratedBooks,
                comments,
                readingList,
                dailyStats
            }
        };
    } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' };
    }
}
