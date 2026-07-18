import { Book } from '@/modules/shared/core/database/client';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Heart, Star, Plus, BookOpen, Clock, Check } from 'lucide-react';
import { generateSimpleDescription } from '@/modules/platform/storage/services/pdf-description-generator';

interface BookCardProps {
    book: Book;
    onLike?: () => void;
    onRate?: (rating: number) => void;
    onAddToList?: (status: 'want_to_read' | 'currently_reading' | 'finished') => void;
    isLiked?: boolean;
    userRating?: number;
}

export default function BookCard({
    book,
    onLike,
    onRate,
    onAddToList,
    isLiked = false,
    userRating = 0,
}: BookCardProps) {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Auto-generate description if missing
    const displayDescription = useMemo(() => {
        if (book.description && book.description.trim()) {
            return book.description;
        }
        // Generate description automatically
        return generateSimpleDescription(book.title, book.author);
    }, [book.description, book.title, book.author]);

    const handleCardClick = () => {
        router.push(`/books/${book.id}`);
    };

    return (
        <div
            className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] transition-all duration-500 cursor-pointer h-full flex flex-col"
            onClick={handleCardClick}
            style={{
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
            }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }}
        >
            {/* Cover Image with Loading State */}
            <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
                {!imageLoaded && book.cover_url && !hasError && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse"
                        style={{ animation: 'shimmer 2s ease-in-out infinite' }}
                    />
                )}
                {book.cover_url && !hasError ? (
                    <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className={`object-cover transition-all duration-750 z-10 group-hover:scale-[1.03] group-hover:brightness-105 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                            setImageLoaded(true);
                            setHasError(true);
                        }}
                    />
                ) : null}

                {/* Default Book Cover - Always rendered in the background as a perfect placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0">
                        {/* Book Icon */}
                        <div className="mb-4 text-white/20">
                            <BookOpen size={64} strokeWidth={1.5} />
                        </div>
                        {/* Book Title on Cover */}
                        <div className="text-center space-y-2">
                            <h4 className="text-white/90 font-display font-bold text-sm leading-tight line-clamp-3">
                                {book.title}
                            </h4>
                            <p className="text-white/60 text-xs font-medium line-clamp-2">
                                {book.author}
                            </p>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                    <p className="text-white text-sm line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {displayDescription}
                    </p>
                </div>

                {/* Featured Badge */}
                {book.is_featured && (
                    <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 z-20">
                        <Star size={10} fill="currentColor" />
                        Featured
                    </div>
                )}
            </div>

            {/* Book Info */}
            <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-white line-clamp-1 mb-0.5 group-hover:text-primary-light transition-colors leading-tight">
                        {book.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 mb-1 font-medium truncate">by {book.author}</p>
                    
                    <p className="text-[12px] text-slate-400 font-medium truncate">
                        {book.genre}{book.language ? ` • ${book.language}` : ''} • {book.release_date ? new Date(book.release_date).getFullYear() : '2025'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                    {/* Like/Save Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onLike) onLike();
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isLiked
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        title={isLiked ? 'Saved' : 'Save'}
                    >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{isLiked ? 'Saved' : 'Save'}</span>
                    </button>

                    {/* Primary action "Read →" */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/books/${book.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.05]"
                    >
                        <span>Read</span>
                        <span className="text-[10px]">→</span>
                    </button>

                    {/* Download Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (book.pdf_url) {
                                const link = document.createElement('a');
                                link.href = book.pdf_url;
                                link.download = `${book.title}.pdf`;
                                link.click();
                            }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-green-600/20 hover:text-green-400 transition-all transform hover:scale-110 ml-auto"
                        title="Download PDF"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>

                    {/* Add to List */}
                    {onAddToList && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                onBlur={() => setTimeout(() => setShowMenu(false), 200)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary-light text-slate-400 transition-all transform hover:scale-110"
                                title="Add to reading list"
                            >
                                <Plus size={14} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToList('want_to_read');
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                                    >
                                        <BookOpen size={16} />
                                        <span>Want to Read</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToList('currently_reading');
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                                    >
                                        <Clock size={16} />
                                        <span>Currently Reading</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToList('finished');
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary/20 hover:text-white transition-colors"
                                    >
                                        <Check size={16} />
                                        <span>Finished</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

