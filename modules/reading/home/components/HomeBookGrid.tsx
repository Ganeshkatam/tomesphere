'use client';

import { FadeIn, StaggerContainer, StaggerItem } from '@/modules/shared/ui/animations';
import BookCard from '@/modules/reading/books/components/BookCard';
import { Sparkles, Flame, BookOpen, Heart } from 'lucide-react';
import { Book } from '@/modules/shared/core/database/client';

interface HomeBookGridProps {
    recommendations: Book[];
    trendingBooks: Book[];
    currentlyReadingBooks: Book[];
    wantToReadBooks: Book[];
    favoriteGenreBooks: Book[];
    likedBooksRecs: Book[];
    userStats: any;
    userLikes: Set<string>;
    userRatings: Map<string, number>;
    handleLike: (id: string) => Promise<void>;
    handleRate: (id: string, rating: number) => Promise<void>;
    handleAddToList: (id: string, status: any) => Promise<void>;
}

export default function HomeBookGrid({
    recommendations,
    trendingBooks,
    currentlyReadingBooks,
    wantToReadBooks,
    favoriteGenreBooks,
    likedBooksRecs,
    userStats,
    userLikes,
    userRatings,
    handleLike,
    handleRate,
    handleAddToList
}: HomeBookGridProps) {
    
    const renderSection = (title: string, icon: React.ReactNode, subtitle: string, books: Book[]) => {
        if (!books || books.length === 0) return null;
        
        return (
            <FadeIn className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2 flex items-center">
                            {icon}
                            <span className="ml-2">{title}</span>
                        </h2>
                        <p className="text-slate-400">{subtitle}</p>
                    </div>
                </div>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {books.slice(0, 5).map((book) => (
                        <StaggerItem key={book.id}>
                            <BookCard
                                book={book}
                                onLike={() => handleLike(book.id)}
                                onRate={(rating) => handleRate(book.id, rating)}
                                onAddToList={(status) => handleAddToList(book.id, status)}
                                isLiked={userLikes.has(book.id)}
                                userRating={userRatings.get(book.id) || 0}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </FadeIn>
        );
    };

    return (
        <div className="w-full">
            {renderSection("For You", <Sparkles size={32} className="text-indigo-400" />, "Personalized picks based on your reading preferences", recommendations)}
            {renderSection("Trending Now", <Flame size={32} className="text-orange-400" />, "Popular books on TomeSphere right now", trendingBooks)}
            {renderSection("Continue Your Journey", <BookOpen size={32} className="text-sky-400" />, "Pick up where you left off", currentlyReadingBooks)}
            {renderSection("On Your Wishlist", <BookOpen size={32} className="text-pink-400" />, "Books you're planning to read", wantToReadBooks)}
            {userStats?.favoriteGenre && renderSection(`More ${userStats.favoriteGenre}`, <Heart size={32} className="text-purple-400" />, `Since you love ${userStats.favoriteGenre}, here are more recommendations`, favoriteGenreBooks)}
            {renderSection("Because You're Loving Your Reads", <Heart size={32} className="text-rose-400" />, `Based on your ${userStats?.totalLikes || 0} liked books`, likedBooksRecs)}
        </div>
    );
}

