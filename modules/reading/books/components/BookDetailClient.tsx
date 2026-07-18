'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/modules/shared/core/database/client';
import Navbar from '@/modules/shared/navigation/components/Navbar';
import { showError, showSuccess } from '@/lib/toast';
import { ArrowLeft, BookOpen, Heart } from 'lucide-react';
import { generateSimpleDescription } from '@/modules/platform/storage/services/pdf-description-generator';
import { toggleLike, addReviewAction, rateBook } from '@/modules/reading/books/actions/books';

interface BookDetailClientProps {
    user: any;
    initialBook: Book;
    initialAvgRating: number;
    initialRatingCount: number;
    initialIsLiked: boolean;
    initialUserRating: number;
    initialReviews: any[];
}

export default function BookDetailClient({
    user,
    initialBook,
    initialAvgRating,
    initialRatingCount,
    initialIsLiked,
    initialUserRating,
    initialReviews
}: BookDetailClientProps) {
    const router = useRouter();
    const book = initialBook;
    
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'quotes'>('overview');
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [userRating, setUserRating] = useState(initialUserRating);
    const [avgRating, setAvgRating] = useState(initialAvgRating);
    const [ratingCount, setRatingCount] = useState(initialRatingCount);
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    
    // Using simple states here since data is injected
    const [reviewContent, setReviewContent] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    


    const handleLike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const res = await toggleLike(book.id);
            if (!res.success) {
                showError(res.error);
                return;
            }
            setIsLiked(res.data.liked);
            showSuccess(res.data.liked ? 'Added to likes!' : 'Removed from likes');
        } catch (error) {
            showError('Failed to update like');
        }
    };

    const handlePostReview = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!reviewContent.trim()) {
            showError('Review cannot be empty');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await addReviewAction(book.id, reviewContent);

            if (!res.success) throw new Error(res.error);

            showSuccess('Review posted!');
            setReviewContent('');
            
            // Optimistically update reviews
            setReviews([{
                id: Math.random().toString(),
                content: reviewContent,
                created_at: new Date().toISOString(),
                profiles: { name: user.user_metadata?.full_name || 'You' }
            }, ...reviews]);
        } catch (error) {
            console.error('Error posting review:', error);
            showError('Failed to post review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleRate = async (rating: number) => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const res = await rateBook(book.id, rating);
            if (!res.success) throw new Error(res.error);
            
            setUserRating(rating);
            showSuccess(`Rated ${rating} stars!`);
            
            // Adjust avg rating optimistically
            if (userRating === 0) {
                setAvgRating((avgRating * ratingCount + rating) / (ratingCount + 1));
                setRatingCount(ratingCount + 1);
            }
        } catch (error) {
            showError('Failed to rate');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-page">

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>




                {/* Book Header */}
                <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12 animate-fadeIn">
                    {/* Book Cover */}
                    <div className="space-y-4">
                        <div className="card-elevated rounded-2xl overflow-hidden aspect-[2/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-6xl">📚</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-3">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push(`/read/${book.id}`)}
                                    className="flex-1 btn btn-primary py-3 rounded-lg flex items-center justify-center gap-2 font-bold"
                                >
                                    <BookOpen size={20} />
                                    Read Book
                                </button>

                                <button
                                    onClick={handleLike}
                                    className={`p-3 rounded-lg border transition-all ${isLiked
                                        ? 'bg-red-500/10 border-red-500 text-red-500'
                                        : 'border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                            <button
                                onClick={async () => {
                                    if (book.pdf_url) {
                                        try {
                                            const response = await fetch(book.pdf_url);
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = `${book.title}.pdf`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(url);
                                            showSuccess('Download started!');
                                        } catch {
                                            const link = document.createElement('a');
                                            link.href = book.pdf_url;
                                            link.download = `${book.title}.pdf`;
                                            link.setAttribute('download', '');
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            showSuccess('Download started!');
                                        }
                                    } else {
                                        showError('Download not available');
                                    }
                                }}
                                className="btn btn-accent w-full"
                            >
                                ⬇️ Download PDF
                            </button>
                            <button className="btn btn-ghost w-full">
                                ➕ Add to Collection
                            </button>
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-5xl font-display font-bold mb-3">{book.title}</h1>
                            <p className="text-2xl text-slate-400 mb-4">by {book.author}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(star)}
                                            className="text-3xl transition-all hover:scale-110"
                                        >
                                            {star <= (userRating || avgRating) ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-xl font-semibold">
                                    {avgRating.toFixed(1)}
                                </span>
                                <span className="text-slate-400">({ratingCount} ratings)</span>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="glass px-4 py-2 rounded-full text-sm">
                                    {book.genre}
                                </span>
                                {book.pages && (
                                    <span className="glass px-4 py-2 rounded-full text-sm">
                                        {book.pages} pages
                                    </span>
                                )}
                                {book.language && (
                                    <span className="glass px-4 py-2 rounded-full text-sm">
                                        {book.language}
                                    </span>
                                )}
                                {book.release_date && (
                                    <span className="glass px-4 py-2 rounded-full text-sm">
                                        {new Date(book.release_date).getFullYear()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description — inside right column */}
                        <div>
                            <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">Description</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {book.description || generateSimpleDescription(book.title, book.author)}
                            </p>
                        </div>

                        {book.publisher && (
                            <div>
                                <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">Publisher</h3>
                                <p className="text-slate-300">{book.publisher}</p>
                            </div>
                        )}

                        {book.isbn && (
                            <div>
                                <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">ISBN</h3>
                                <p className="text-slate-300 font-mono">{book.isbn}</p>
                            </div>
                        )}
                    </div>
                </div> {/* End grid */}

                {/* Community Reviews — full width below grid */}
                <div className="mt-12 space-y-6 animate-fadeIn pt-8 border-t border-white/10">
                    <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                    
                    {/* Review Input */}
                    {user ? (
                        <div className="glass p-4 rounded-xl border border-white/5 mb-8">
                            <h4 className="text-lg font-bold mb-3">Write a Review</h4>
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                placeholder="Share your thoughts about this book..."
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-all resize-none mb-3"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handlePostReview}
                                    disabled={isSubmittingReview || !reviewContent.trim()}
                                    className="btn btn-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingReview ? 'Posting...' : 'Post Review'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass p-6 text-center rounded-xl border border-white/5 mb-8">
                            <p className="text-slate-300 mb-4">Please log in to leave a review.</p>
                            <button onClick={() => router.push('/login')} className="btn btn-secondary">
                                Log In
                            </button>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="card">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                            {review.profiles?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{review.profiles?.name || 'Anonymous'}</div>
                                            <div className="text-sm text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300">{review.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400 md:col-span-2">
                                No reviews yet. Be the first to review!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
