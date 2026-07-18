import LandingClient from '@/modules/platform/landing/components/LandingClient';
import { getBooks } from '@/modules/reading/books/actions/books';
import { getTrendingBooks } from '@/modules/reading/books/actions/trending';

export const dynamic = 'force-dynamic';

export default async function Page() {
    // Server-side data orchestration — zero spinners on initial load
    const [popularBooks, allBooksRes] = await Promise.all([
        getTrendingBooks(15),
        getBooks(100),
    ]);

    const allBooks = allBooksRes.success ? allBooksRes.data.items : [];

    return (
        <LandingClient
            initialPopularBooks={popularBooks.items}
            initialAllBooks={allBooks}
        />
    );
}
