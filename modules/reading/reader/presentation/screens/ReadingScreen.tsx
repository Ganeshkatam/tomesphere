'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookById } from '@/modules/reading/books/actions/books';
import { getCurrentUser } from '@/modules/platform/authentication/actions/auth';
import LoadingSpinner from '@/modules/shared/ui/LoadingSpinner';
import { showError } from '@/lib/toast';
import { Book } from '@/modules/shared/core/database/client';
import { ReaderShell } from '@/modules/reading/reader/components/ReaderShell';

export default function ReadingPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!bookId) return;
        setLoading(true);

        const [bookRes, userRes] = await Promise.all([
            getBookById(bookId),
            getCurrentUser()
        ]);

        if (bookRes.success && bookRes.data) {
            setBook(bookRes.data as any);
        } else {
            showError('Book not found');
            router.push('/library');
            return;
        }

        if (userRes.success && userRes.data) {
            setUserId(userRes.data.id);
        } else {
            showError('User not authenticated');
            router.push('/login');
            return;
        }

        setLoading(false);
    }, [bookId, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading || !userId) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-slate-400">Book not found</p>
            </div>
        );
    }

    // Default to PDF if type is unknown for this mock
    const fileType = (book as any).file_type || 'pdf';
    const fileUrl = (book as any).file_url || '/mock-document.pdf';

    return (
        <ReaderShell 
            bookId={book.id} 
            fileUrl={fileUrl} 
            fileType={fileType} 
            userId={userId}
        />
    );
}

