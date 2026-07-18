import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { getBookDetailsPageData } from '@/modules/reading/books/actions/books';
import BookDetailClient from '@/modules/reading/books/components/BookDetailClient';

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const res = await getBookDetailsPageData(id);
    
    if (!res.success) {
        return (
            <div className="min-h-screen bg-gradient-page flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
                    <a href="/home" className="btn btn-primary inline-block">
                        Go Back
                    </a>
                </div>
            </div>
        );
    }

    const data = res.data;

    return (
        <BookDetailClient
            user={user}
            initialBook={data.book}
            initialAvgRating={data.avgRating}
            initialRatingCount={data.ratingCount}
            initialIsLiked={data.isLiked}
            initialUserRating={data.userRating}
            initialReviews={data.reviews}
        />
    );
}
