import { supabase } from '@/modules/shared/core/database/client';
import type { Database } from '@/modules/shared/core/types/database';

type Book = Database['public']['Tables']['books']['Row'];
type Like = Database['public']['Tables']['book_likes']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];
type ReadingList = Database['public']['Tables']['library_books']['Row'];

interface RecommendationScore {
    book: Book;
    score: number;
}

/**
 * @deprecated Use the Discovery bounded context's RecommendationPipeline instead.
 * This file is slated for removal after Release A is completely stabilized.
 */
export async function generateAIRecommendations(userId: string, allBooks: Book[]): Promise<Book[]> {
    try {
        // Get user's liked books
        const { data: likes } = await supabase
            .from('book_likes')
            .select('book_id')
            .eq('user_id', userId);

        // Get user's ratings (4+ stars)
        const { data: ratings } = await supabase
            .from('ratings')
            .select('book_id, rating')
            .eq('user_id', userId)
            .gte('rating', 4);

        // Get user's reading list
        const { data: readingList } = await supabase
            .from('library_books')
            .select('book_id, status')
            .eq('user_id', userId);

        const likedBookIds = new Set(likes?.map((l: Pick<Like, 'book_id'>) => l.book_id) || []);
        const ratedBookIds = new Set(ratings?.map((r: Pick<Rating, 'book_id' | 'rating'>) => r.book_id) || []);
        const readingListIds = new Set(readingList?.map((r: Pick<ReadingList, 'book_id' | 'status'>) => r.book_id) || []);

        // Get books user has interacted with
        const interactedBooks = allBooks.filter(book =>
            likedBookIds.has(book.id) || ratedBookIds.has(book.id)
        );

        // Extract preferred genres
        const genreCount: { [key: string]: number } = {};
        interactedBooks.forEach(book => {
            genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
        });

        // Extract preferred authors
        const authorCount: { [key: string]: number } = {};
        interactedBooks.forEach(book => {
            authorCount[book.author] = (authorCount[book.author] || 0) + 1;
        });

        // Score books
        const recommendations: RecommendationScore[] = allBooks
            .filter(book =>
                !likedBookIds.has(book.id) &&
                !ratedBookIds.has(book.id) &&
                !readingListIds.has(book.id)
            )
            .map(book => {
                let score = 0;

                // Genre matching (strongest signal)
                if (genreCount[book.genre]) {
                    score += genreCount[book.genre] * 10;
                }

                // Author matching
                if (authorCount[book.author]) {
                    score += authorCount[book.author] * 8;
                }

                // Featured books bonus
                if (book.is_featured) {
                    score += 5;
                }

                // Recency bonus (newer books)
                if (book.release_date) {
                    const releaseYear = new Date(book.release_date).getFullYear();
                    const currentYear = new Date().getFullYear();
                    if (currentYear - releaseYear <= 2) {
                        score += 3;
                    }
                }

                return { book, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        // If no personalized recommendations, return trending or featured books
        if (recommendations.length === 0) {
            return allBooks
                .filter(book =>
                    book.is_featured &&
                    !likedBookIds.has(book.id) &&
                    !readingListIds.has(book.id)
                )
                .slice(0, 6);
        }

        return recommendations.map(r => r.book);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        // Fallback to featured books
        return allBooks.filter(book => book.is_featured).slice(0, 6);
    }
}

export async function getTrendingBooks(limit: number = 10): Promise<Book[]> {
    try {
        // Get books with most likes in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: trendingLikes } = await supabase
            .from('book_likes')
            .select('book_id')
            .gte('created_at', thirtyDaysAgo.toISOString());

        // Count likes per book
        const likeCounts: { [key: string]: number } = {};
        trendingLikes?.forEach((like: Pick<Like, 'book_id'>) => {
            likeCounts[like.book_id] = (likeCounts[like.book_id] || 0) + 1;
        });

        // Sort by count
        const sortedBookIds = Object.entries(likeCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([bookId]) => bookId);

        if (sortedBookIds.length === 0) {
            // Fallback to featured books
            const { data: books } = await supabase
                .from('books')
                .select('*')
                .eq('is_featured', true)
                .limit(limit);
            return books || [];
        }

        // Fetch the actual books
        const { data: books } = await supabase
            .from('books')
            .select('*')
            .in('id', sortedBookIds);

        // Sort books by their like count
        const sortedBooks = sortedBookIds
            .map(id => books?.find((book: Book) => book.id === id))
            .filter(Boolean) as Book[];

        return sortedBooks;
    } catch (error) {
        console.error('Error getting trending books:', error);
        return [];
    }
}
