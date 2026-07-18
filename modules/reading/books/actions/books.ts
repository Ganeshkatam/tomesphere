'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { revalidatePath } from 'next/cache';
import type { Book, Rating } from '@/modules/shared/core/database/client';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';
import { Tables } from '@/modules/shared/core/types/supabase';

import { SupabaseBookRepository } from '../infrastructure/SupabaseBookRepository';
import { BookId } from '../domain/value-objects';
import { getBook } from '../application/queries/GetBook/handler';
import { GetBookOutput } from '../application/queries/GetBook/read-model';
import { getTrendingBooks } from '../application/queries/GetTrendingBooks/handler';
import { searchBooks } from '../application/queries/SearchBooks/handler';
import { SearchBooksOutput } from '../application/queries/SearchBooks/read-model';
import { SupabaseSignalRepository } from '@/modules/discovery/recommendations/infrastructure/SupabaseSignalRepository';
import { SupabaseSearchRepository } from '@/modules/discovery/search/infrastructure/repositories/SupabaseSearchRepository';
import { UserRecommendationContextProvider } from '@/modules/discovery/recommendations/infrastructure/UserRecommendationContextProvider';
import { SearchCandidateProvider } from '@/modules/discovery/recommendations/infrastructure/SearchCandidateProvider';
import { RecommendationExplanationService } from '@/modules/discovery/recommendations/application/services/RecommendationExplanationService';
import { GetPersonalizedRecommendationsHandler } from '@/modules/discovery/recommendations/application/queries/GetPersonalizedRecommendations/handler';

import {

    RateBookInput,
    AddToReadingListInput,
    ReviewInput,
    UpdateReadingProgressInput,
    ToggleBookmarkInput,
    SearchBooksInput,
    SearchSuggestionsInput,
    UploadAcademicBookInput,
    UUIDSchema,
    validateInput,
} from '@/lib/validators';

// ─── Platform Stats ──────────────────────────────────────────

export async function getPlatformStats(): Promise<ActionResult<{ books: number; profiles: number; study_groups: number; satisfaction: number }>> {
    const supabase = await createSupabaseServerClient();
    
    const [booksRes, profilesRes, groupsRes, reviewsRes] = await Promise.all([
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('study_groups').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('rating').limit(100)
    ]);

    if (booksRes.error?.message) console.error('[getPlatformStats books]', booksRes.error.message);
    if (profilesRes.error?.message) console.error('[getPlatformStats profiles]', profilesRes.error.message);
    if (groupsRes.error?.message) console.error('[getPlatformStats groups]', groupsRes.error.message);

    let satisfaction = 0;
    if (reviewsRes.data && reviewsRes.data.length > 0) {
        const sum = reviewsRes.data.reduce((acc, curr) => acc + curr.rating, 0);
        satisfaction = Math.round((sum / (reviewsRes.data.length * 5)) * 100);
    } else {
        satisfaction = 100; // Default to 100 if no reviews exist
    }

    return { 
        success: true, 
        data: { 
            books: booksRes.count || 0, 
            profiles: profilesRes.count || 0,
            study_groups: groupsRes.count || 0,
            satisfaction
        } 
    };
}

export async function getFooterStats(): Promise<ActionResult<{ bookCount: number; subjectCount: number; readerCount: number }>> {
    try {
        const supabase = await createSupabaseServerClient();

        const [booksRes, profilesRes, genresRes] = await Promise.all([
            supabase.from('books').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('books').select('genre, academic_subject'),
        ]);

        // Count distinct genres + academic_subjects
        const subjectSet = new Set<string>();
        (genresRes.data || []).forEach(b => {
            if (b.genre) subjectSet.add(b.genre.toLowerCase().trim());
            if (b.academic_subject) subjectSet.add(b.academic_subject.toLowerCase().trim());
        });

        return {
            success: true,
            data: {
                bookCount: booksRes.count || 0,
                subjectCount: subjectSet.size,
                readerCount: profilesRes.count || 0,
            }
        };
    } catch (err) {
        return { success: false, error: 'Failed to fetch footer stats' };
    }
}

// ─── Books ───────────────────────────────────────────────────

import { unstable_cache } from 'next/cache';
import { supabase as statelessSupabase } from '@/modules/shared/core/database/client';

export const getBooks = unstable_cache(
    async (limit: number = 50): Promise<ActionResult<SearchBooksOutput>> => {
        const repository = new SupabaseBookRepository(statelessSupabase);
        
        const output = await searchBooks(repository, { limit });
        
        return { success: true, data: output };
    },
    ['get-books-global'],
    { revalidate: 60, tags: ['books'] }
);

export async function searchFilteredBooks(search?: string, genreFilters?: string[]): Promise<ActionResult<SearchBooksOutput>> {
    const validated = validateInput(SearchBooksInput, { search, genreFilters });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseBookRepository(supabase);

    const output = await searchBooks(repository, {
        term: validated.data.search,
        genreFilters: validated.data.genreFilters,
        limit: 50
    });

    return { success: true, data: output };
}

// logActivity removed — replaced by outbox pattern via save_*_with_events RPCs

export async function toggleLike(bookId: string): Promise<ActionResult<{ liked: boolean }>> {
    const idCheck = validateInput(UUIDSchema, bookId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: existingLike } = await supabase
        .from('book_likes')
        .select('id')
        .eq('book_id', idCheck.data)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        // Unlike — no outbox event needed for unliking
        const { error } = await supabase.from('book_likes').delete().eq('book_id', idCheck.data).eq('user_id', user.id);
        if (error) return { success: false, error: 'Failed to unlike book' };
        revalidatePath('/home');
        return { success: true, data: { liked: false } };
    } else {
        // Like — use atomic RPC with outbox
        const { error } = await supabase.rpc('save_book_action_with_events', {
            p_action_type: 'like',
            p_user_id: user.id,
            p_book_id: idCheck.data,
            p_action_data: {},
            p_events: [{
                aggregate_type: 'Book',
                aggregate_id: idCheck.data,
                event_type: 'book:liked',
                event_version: 1,
                payload: { userId: user.id, bookId: idCheck.data },
                occurred_at: new Date().toISOString()
            }]
        });
        if (error) return { success: false, error: 'Failed to like book' };
        revalidatePath('/home');
        return { success: true, data: { liked: true } };
    }
}

export async function rateBook(bookId: string, rating: number): Promise<ActionResult<Rating>> {
    const validated = validateInput(RateBookInput, { bookId, rating });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    // Use atomic RPC with outbox
    const { error } = await supabase.rpc('save_book_action_with_events', {
        p_action_type: 'rate',
        p_user_id: user.id,
        p_book_id: validated.data.bookId,
        p_action_data: { rating: validated.data.rating },
        p_events: [{
            aggregate_type: 'Book',
            aggregate_id: validated.data.bookId,
            event_type: 'book:rated',
            event_version: 1,
            payload: { userId: user.id, bookId: validated.data.bookId, rating: validated.data.rating },
            occurred_at: new Date().toISOString()
        }]
    });

    if (error) return { success: false, error: 'Failed to rate book' };

    // Fetch the rating back to return to the caller
    const { data } = await supabase
        .from('ratings')
        .select()
        .eq('book_id', validated.data.bookId)
        .eq('user_id', user.id)
        .single();

    revalidatePath('/home');
    return { success: true, data: data as Rating };
}

export async function addToReadingList(bookId: string, status: string): Promise<ActionResult> {
    const validated = validateInput(AddToReadingListInput, { bookId, status });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { bookId: vBookId, status: vStatus } = validated.data;

    // Fetch existing session if any, so we don't overwrite current_page with 0
    const { data: existingSession } = await supabase
        .from('reader_sessions')
        .select('current_page, percentage')
        .eq('user_id', user.id)
        .eq('book_id', vBookId)
        .maybeSingle();

    const currentPage = existingSession?.current_page || 0;
    const percentage = existingSession?.percentage || 0;

    const stagedEvents = [
        {
            aggregate_type: 'Library',
            aggregate_id: vBookId,
            event_type: 'library:book_added',
            event_version: 1,
            payload: { userId: user.id, bookId: vBookId, status: vStatus },
            occurred_at: new Date().toISOString()
        }
    ];

    const { error: rpcError } = await supabase.rpc('save_reader_session_with_events', {
        p_user_id: user.id,
        p_book_id: vBookId,
        p_current_page: currentPage,
        p_percentage: percentage,
        p_library_status: vStatus,
        p_events: stagedEvents
    });

    if (rpcError) {
        console.error('[addToReadingList] RPC failed:', rpcError.message);
        return { success: false, error: 'Failed to update reading list' };
    }

    revalidatePath('/home');
    return { success: true, data: undefined };
}


// ─── Academic / Textbooks ────────────────────────────────────

export async function getAcademicBooks(subject?: string): Promise<ActionResult<Book[]>> {
    const supabase = await createSupabaseServerClient();
    let query = supabase.from('books').select('*').eq('is_textbook', true).order('title');

    if (subject && subject !== 'All Subjects') {
        query = query.eq('academic_subject', subject);
    }

    const { data, error } = await query;
    if (error) return { success: false, error: 'Failed to fetch academic books' };
    return { success: true, data: data as Book[] };
}

export async function uploadAcademicBook(
    title: string,
    author: string,
    subject: string,
    pdfUrl: string
): Promise<ActionResult<Book>> {
    const validated = validateInput(UploadAcademicBookInput, { title, author, subject, pdfUrl });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase.from('books').insert({
        title: validated.data.title,
        author: validated.data.author,
        academic_subject: validated.data.subject,
        pdf_url: validated.data.pdfUrl,
        is_textbook: true,
        genre: 'Academic',
        description: `Academic resource for ${validated.data.subject}`,
        pages: 0,
        cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300&h=450',
    }).select().single();

    if (error) return { success: false, error: 'Failed to upload academic book' };
    return { success: true, data: data as Book };
}

// ─── Reading & Bookmarks ─────────────────────────────────────

export async function getBookById(bookId: string): Promise<ActionResult<GetBookOutput>> {
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseBookRepository(supabase);
    
    const output = await getBook(repository, { bookId: BookId.create(bookId) });
    
    if (!output) {
        return { success: false, error: 'Book not found' };
    }
    
    return { success: true, data: output };
}

export interface BookDetailsPayload {
    book: Book;
    avgRating: number;
    ratingCount: number;
    isLiked: boolean;
    userRating: number;
    reviews: Array<Tables<'reviews'> & { profiles: { name: string; avatar_url: string | null } }>;
}

export async function getBookDetailsPageData(bookId: string): Promise<ActionResult<BookDetailsPayload>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [bookRes, ratingsRes, reviewsRes] = await Promise.all([
        supabase.from('books').select('*').eq('id', bookId).single(),
        supabase.from('ratings').select('rating, user_id').eq('book_id', bookId),
        supabase.from('reviews').select('*, profiles(name, avatar_url)').eq('book_id', bookId).order('created_at', { ascending: false }).limit(10)
    ]);

    if (bookRes.error || !bookRes.data) return { success: false, error: 'Book not found' };

    let isLiked = false;
    let userRating = 0;

    if (user) {
        const [{ data: likeData }, userRatingData] = await Promise.all([
            supabase.from('book_likes').select('id').eq('book_id', bookId).eq('user_id', user.id).single(),
            ratingsRes.data?.find(r => r.user_id === user.id)
        ]);
        isLiked = !!likeData;
        userRating = userRatingData?.rating || 0;
    }

    let avgRating = 0;
    let ratingCount = 0;
    if (ratingsRes.data && ratingsRes.data.length > 0) {
        avgRating = ratingsRes.data.reduce((sum, r) => sum + r.rating, 0) / ratingsRes.data.length;
        ratingCount = ratingsRes.data.length;
    }

    return {
        success: true,
        data: {
            book: bookRes.data,
            avgRating,
            ratingCount,
            isLiked,
            userRating,
            reviews: reviewsRes.data || []
        }
    };
}

export async function addReviewAction(bookId: string, content: string): Promise<ActionResult> {
    const validated = validateInput(ReviewInput, { bookId, content });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.rpc('save_book_action_with_events', {
        p_action_type: 'review',
        p_user_id: user.id,
        p_book_id: validated.data.bookId,
        p_action_data: { content: validated.data.content },
        p_events: [{
            aggregate_type: 'Book',
            aggregate_id: validated.data.bookId,
            event_type: 'book:rated',
            event_version: 1,
            payload: { userId: user.id, bookId: validated.data.bookId },
            occurred_at: new Date().toISOString()
        }]
    });

    if (error) return { success: false, error: 'Failed to post review' };
    return { success: true, data: undefined };
}

export async function getBookmarks(bookId: string): Promise<ActionResult<Tables<'bookmarks'>[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .order('page_number', { ascending: true });

    if (error) return { success: false, error: 'Failed to fetch bookmarks' };
    return { success: true, data: data || [] };
}

export async function getReadingProgress(bookId: string): Promise<ActionResult<{ current_page: number; progress_percentage: number }>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('reader_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();

    if (error) return { success: false, error: 'Failed to fetch reading progress' };
    return { success: true, data: { current_page: data?.current_page || 0, progress_percentage: data?.percentage || 0 } };
}

export async function updateReadingProgress(bookId: string, currentPage: number, progressPercentage: number): Promise<ActionResult> {
    const validated = validateInput(UpdateReadingProgressInput, { bookId, currentPage, progressPercentage });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { bookId: vBookId, currentPage: vPage, progressPercentage: vProgress } = validated.data;

    const isFinished = vProgress >= 100;
    const status = isFinished ? 'finished' : 'currently_reading';

    // Fetch previous session to calculate delta
    const { data: previousSession } = await supabase
        .from('reader_sessions')
        .select('current_page, id')
        .eq('user_id', user.id)
        .eq('book_id', vBookId)
        .single();

    const previousPage = previousSession?.current_page || 0;
    const pagesReadDelta = Math.max(0, vPage - previousPage);
    const sessionId = previousSession?.id || vBookId; // fallback to bookId if new session

    // Stage domain events as JSONB for the outbox
    const stagedEvents = [
        {
            aggregate_type: 'ReaderSession',
            aggregate_id: vBookId,
            event_type: 'reader:progress_updated',
            event_version: 1,
            payload: { 
                userId: user.id, 
                bookId: vBookId, 
                readerSessionId: sessionId,
                previousPage,
                currentPage: vPage,
                pagesReadDelta,
                occurredAt: new Date().toISOString()
            },
            occurred_at: new Date().toISOString()
        },
        ...(isFinished ? [{
            aggregate_type: 'ReaderSession',
            aggregate_id: vBookId,
            event_type: 'reader:book_completed',
            event_version: 1,
            payload: { userId: user.id, bookId: vBookId },
            occurred_at: new Date().toISOString()
        }] : [])
    ];

    // Atomic persistence: reader_sessions + library_books + outbox_messages in one transaction
    const { error: rpcError } = await supabase.rpc('save_reader_session_with_events', {
        p_user_id: user.id,
        p_book_id: vBookId,
        p_current_page: vPage,
        p_percentage: vProgress,
        p_library_status: status,
        p_events: stagedEvents
    });

    if (rpcError) {
        console.error('[updateReadingProgress] RPC failed:', rpcError.message);
        return { success: false, error: 'Failed to update reading progress' };
    }

    // Log to activity_log for the public feed (retained during transition)
    await supabase.from('activity_log').insert({
        user_id: user.id,
        action_type: isFinished ? 'finish_book' : 'read_session',
        book_id: vBookId,
        metadata: { pages_read: pagesReadDelta, progress_percentage: vProgress }
    });

    revalidatePath('/home');
    return { success: true, data: undefined };
}

export async function toggleBookmark(bookId: string, pageNumber: number): Promise<ActionResult<{ isBookmarked: boolean }>> {
    const validated = validateInput(ToggleBookmarkInput, { bookId, pageNumber });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { bookId: vBookId, pageNumber: vPage } = validated.data;

    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', vBookId)
        .eq('page_number', vPage)
        .single();

    if (existing) {
        await supabase.from('bookmarks').delete().eq('id', existing.id);
        return { success: true, data: { isBookmarked: false } };
    } else {
        await supabase.from('bookmarks').insert({
            user_id: user.id,
            book_id: vBookId,
            page_number: vPage,
            label: `Page ${vPage}`
        });
        return { success: true, data: { isBookmarked: true } };
    }
}

// removed getTrendingBooks import

// ─── Personalized Dashboard Data ────────────────────────────────

export interface PersonalizedDashboard {
    likes: string[];
    ratings: [string, number][];
    trending: GetBookOutput[];
    favoriteGenreBooks: Tables<'books'>[];
    wantToRead: Tables<'books'>[];
    currentlyReading: Tables<'books'>[];
    recommendations: Tables<'books'>[];
    todayStats: Tables<'analytics_user_daily'> | null;
    notes?: any[];
    bookmarksCount?: number;
    latestHighlight?: any;
}

export async function getPersonalizedDashboard(): Promise<ActionResult<PersonalizedDashboard>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const repository = new SupabaseBookRepository(supabase);
    const trendingBooks = await getTrendingBooks(repository, 10);

    const today = new Date().toISOString().split('T')[0];
    const [likesRes, ratingsRes, readingListRes, dailyStatsRes, genreStatsRes] = await Promise.all([
        supabase.from('book_likes').select('book_id').eq('user_id', user.id),
        supabase.from('ratings').select('book_id, rating').eq('user_id', user.id),
        supabase.from('library_books').select('book_id, status, books(*)').eq('user_id', user.id),
        supabase.from('analytics_user_daily').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
        supabase.from('analytics_user_genres').select('*').eq('user_id', user.id)
    ]);

    // Get recommendations from the DDD pipeline (replaces legacy get_recommendations RPC)
    const signalRepo = new SupabaseSignalRepository(supabase);
    const searchRepo = new SupabaseSearchRepository(supabase);
    const contextProvider = new UserRecommendationContextProvider(signalRepo);
    const candidateProvider = new SearchCandidateProvider(searchRepo);
    const explanationService = new RecommendationExplanationService();
    const recHandler = new GetPersonalizedRecommendationsHandler(contextProvider, candidateProvider, explanationService);
    const recResult = await recHandler.execute({ userId: user.id, limit: 10 });

    // Map recommendation read models to Books for the dashboard interface
    let recommendedBooks: Tables<'books'>[] = [];
    if (recResult.success && recResult.data && recResult.data.length > 0) {
        const recBookIds = recResult.data.map(r => r.bookId);
        const { data: booksData } = await supabase.from('books').select('*').in('id', recBookIds);
        recommendedBooks = booksData || [];
    }

    const likesMap = new Set(likesRes.data?.map((l: { book_id: string }) => l.book_id) || []);
    const ratingsMap = new Map();
    ratingsRes.data?.forEach((r: { book_id: string; rating: number }) => ratingsMap.set(r.book_id, r.rating));

    // Calculate favorite genre using the new analytics projection (facts over policy)
    let favGenre = '';
    if (genreStatsRes.data && genreStatsRes.data.length > 0) {
        // App layer defines the affinity policy based on durable facts
        const sortedGenres = genreStatsRes.data.sort((a, b) => {
            const scoreA = (a.books_completed || 0) * 3 + (a.books_started || 0) * 2 + (a.likes_count || 0) + (a.ratings_count || 0) + ((a.pages_read || 0) / 100);
            const scoreB = (b.books_completed || 0) * 3 + (b.books_started || 0) * 2 + (b.likes_count || 0) + (b.ratings_count || 0) + ((b.pages_read || 0) / 100);
            return scoreB - scoreA;
        });
        favGenre = sortedGenres[0].genre;
    }
    
    let favoriteGenreBooks = [];
    if (favGenre) {
        const { data } = await supabase.from('books').select('*').eq('genre', favGenre).limit(4);
        favoriteGenreBooks = data || [];
    }

    // Process reading lists
    const wantToRead = (readingListRes.data?.filter(i => i.status === 'want_to_read').map(i => i.books).filter(Boolean).slice(0, 4) || []) as unknown as Tables<'books'>[];
    const currentlyReading = (readingListRes.data?.filter(i => i.status === 'currently_reading').map(i => i.books).filter(Boolean).slice(0, 4) || []) as unknown as Tables<'books'>[];

    return {
        success: true,
        data: {
            likes: Array.from(likesMap),
            ratings: Array.from(ratingsMap.entries()),
            trending: trendingBooks.items || [],
            favoriteGenreBooks,
            wantToRead,
            currentlyReading,
            recommendations: recommendedBooks,
            todayStats: dailyStatsRes.data || null
        }
    };
}

// ─── Explore Page Data ──────────────────────────────────────

export interface ExploreData {
    books: Book[];
    likes: string[];
    ratings: [string, number][];
}

export async function getExploreData(): Promise<ActionResult<ExploreData>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [booksRes, likesRes, ratingsRes] = await Promise.all([
        supabase.from('books').select('*').order('created_at', { ascending: false }).limit(50),
        user ? supabase.from('book_likes').select('book_id').eq('user_id', user.id) : { data: null },
        user ? supabase.from('ratings').select('book_id, rating').eq('user_id', user.id) : { data: null }
    ]);

    const likesMap = new Set(likesRes.data?.map((l: { book_id: string }) => l.book_id) || []);
    const ratingsMap = new Map<string, number>();
    ratingsRes.data?.forEach((r: { book_id: string; rating: number }) => ratingsMap.set(r.book_id, r.rating));

    return {
        success: true,
        data: {
            books: booksRes.data || [],
            likes: Array.from(likesMap),
            ratings: Array.from(ratingsMap.entries())
        }
    };
}

// ─── Search Suggestions ──────────────────────────────────────

export async function getSearchSuggestions(query: string): Promise<ActionResult<Partial<Book>[]>> {
    const validated = validateInput(SearchSuggestionsInput, { query });
    if (!validated.success) return { success: true, data: [] };

    const sanitized = validated.data.query;
    if (sanitized.length < 2) return { success: true, data: [] };

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('books')
        .select('id, title, author, genre')
        .or(`title.ilike.%${sanitized}%,author.ilike.%${sanitized}%`)
        .limit(5);

    if (error) return { success: false, error: 'Failed to fetch search suggestions' };
    
    return { success: true, data: data || [] };
}
