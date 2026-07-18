'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/modules/shared/core/database/client';
import { motion, AnimatePresence } from 'framer-motion';

import BookCard from '@/modules/reading/books/components/BookCard';
import { EmptyState } from '@/modules/shared/ui/EmptyState';
import { showError, showSuccess } from '@/lib/toast';

import { Book } from '@/modules/shared/core/database/client';
import { searchFilteredBooks, toggleLike, rateBook } from '@/modules/reading/books/actions/books';
import { addBookToLibraryAction } from '@/modules/reading/library/actions/library';

import HomeHero from './HomeHero';
import HomeBookGrid from './HomeBookGrid';
import HomeCuratedSections from './HomeCuratedSections';

interface HomeClientProps {
    user: any | null;
    initialBooks: Book[];
    dashboardData: any | null;
}

export default function HomeClient({ user, initialBooks, dashboardData }: HomeClientProps) {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<any>(user);

    useEffect(() => {
        const fetchClientUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user && !user) {
                setCurrentUser(data.user);
            }
        };
        fetchClientUser();
    }, [user]);

    const [books, setBooks] = useState<Book[]>(initialBooks);

    // Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [genreSearch, setGenreSearch] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchSticky, setIsSearchSticky] = useState(false);

    // Interaction States
    const [userLikes, setUserLikes] = useState<Set<string>>(new Set(dashboardData?.likes || []));
    const [userRatings, setUserRatings] = useState<Map<string, number>>(new Map(dashboardData?.ratings || []));

    // Sticky search bar on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsSearchSticky(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchBooks = async (search?: string, genreFilters?: string[]) => {
        setIsSearching(true);
        try {
            const res = await searchFilteredBooks(search, genreFilters);
            if (res.success) {
                setBooks(res.data.items as any[]);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = () => {
        fetchBooks(searchTerm, selectedGenres);
        const booksSection = document.getElementById('all-books-section');
        if (booksSection) {
            booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleLike = async (bookId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const res = await toggleLike(bookId);
            if (res.success) {
                if (res.data.liked) {
                    setUserLikes(prev => new Set(prev).add(bookId));
                    showSuccess('Added to likes!');
                } else {
                    setUserLikes(prev => {
                        const newLikes = new Set(prev);
                        newLikes.delete(bookId);
                        return newLikes;
                    });
                    showSuccess('Removed from likes');
                }
                router.refresh();
            } else {
                showError(res.error);
            }
        } catch (error) {
            showError('Failed to update like');
        }
    };

    const handleRate = async (bookId: string, rating: number) => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const res = await rateBook(bookId, rating);
            if (res.success) {
                setUserRatings(prev => new Map(prev).set(bookId, rating));
                showSuccess(`Rated ${rating} stars!`);
                router.refresh();
            } else {
                showError(res.error);
            }
        } catch (error: any) {
            showError(error.message || 'Failed to rate book');
        }
    };

    const handleAddToList = async (bookId: string, status: 'want_to_read' | 'currently_reading' | 'finished') => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const res = await addBookToLibraryAction(bookId, status);
            if (res.success) {
                const statusLabels = {
                    want_to_read: 'Want to Read',
                    currently_reading: 'Currently Reading',
                    finished: 'Finished'
                };
                showSuccess(`Added to ${statusLabels[status]}!`);
                router.refresh();
            } else {
                showError(res.error);
            }
        } catch (error) {
            showError('Failed to add to list');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">

            {/* Sticky Search Bar */}
            {isSearchSticky && (
                <div className="fixed top-0 left-0 right-0 z-50 glass-strong border-b-2 border-indigo-500/30 py-4 px-4 shadow-2xl shadow-indigo-500/20 animate-slideDown">
                    <div className="max-w-6xl mx-auto flex gap-3 items-start">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={genreSearch}
                                onChange={(e) => {
                                    setGenreSearch(e.target.value);
                                    setSearchTerm(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (genreSearch) router.push(`/search?q=${genreSearch}`);
                                    }
                                }}
                                placeholder="Search genres or books..."
                                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50"
                            />
                            {/* SVG Icons and Voice Input omitted for brevity, keeping simple */}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium text-sm flex items-center gap-2"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Layout — Full width single-column feed (Netflix for readers) */}
            <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 mt-8 space-y-16">
                
                {/* Home Bento Grid / Greeting */}
                <HomeHero
                    user={currentUser}
                    userStats={{
                        totalLikes: dashboardData?.likes?.length || 0,
                        favoriteGenre: dashboardData?.favoriteGenre || '',
                        todayStats: dashboardData?.todayStats || null
                    }}
                    recommendations={dashboardData?.recommendations || []}
                    currentlyReadingBooks={dashboardData?.currentlyReading || []}
                    wantToReadBooks={dashboardData?.wantToRead || []}
                    notes={dashboardData?.notes || []}
                    bookmarksCount={dashboardData?.bookmarksCount || 0}
                    latestHighlight={dashboardData?.latestHighlight || null}
                />

                {/* Main Content Rows */}
                {currentUser && dashboardData && (
                    <HomeBookGrid
                        recommendations={dashboardData.recommendations}
                        trendingBooks={dashboardData.trending}
                        currentlyReadingBooks={dashboardData.currentlyReading}
                        wantToReadBooks={dashboardData.wantToRead}
                        favoriteGenreBooks={dashboardData.favoriteGenreBooks}
                        likedBooksRecs={[]} // Missing from dashboardData currently
                        userStats={{
                            totalLikes: dashboardData.likes?.length || 0,
                            favoriteGenre: dashboardData.favoriteGenre || '',
                            todayStats: dashboardData.todayStats || null
                        }}
                        userLikes={userLikes}
                        userRatings={userRatings}
                        handleLike={handleLike}
                        handleRate={handleRate}
                        handleAddToList={handleAddToList}
                    />
                )}

                {/* Dynamic Bottom Flow: Search Results vs Curated Learning Hub */}
                {selectedGenres.length > 0 || searchTerm ? (
                    <div id="all-books-section" className="pt-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Search Results
                            </h2>
                        </div>

                        {books.length === 0 && !isSearching ? (
                            <EmptyState
                                title="No books found"
                                description="Your library is looking a bit empty."
                            />
                        ) : (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                }}
                                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {books.map((book) => (
                                        <motion.div
                                            key={book.id}
                                            layout
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                            className="h-full"
                                        >
                                            <BookCard
                                                book={book}
                                                onLike={() => handleLike(book.id)}
                                                onRate={(rating) => handleRate(book.id, rating)}
                                                onAddToList={(status) => handleAddToList(book.id, status)}
                                                isLiked={userLikes.has(book.id)}
                                                userRating={userRatings.get(book.id) || 0}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <HomeCuratedSections 
                        allBooks={initialBooks}
                        currentlyReadingBooks={dashboardData?.currentlyReading || []}
                        wantToReadBooks={dashboardData?.wantToRead || []}
                        userLikes={userLikes}
                        userRatings={userRatings}
                        handleLike={handleLike}
                        handleRate={handleRate}
                        handleAddToList={handleAddToList}
                    />
                )}
            </div>
        </div>
    );
}



