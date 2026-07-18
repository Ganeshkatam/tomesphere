import SearchScreen from '@/modules/reading/search/presentation/screens/SearchScreen';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{ q?: string; genre?: string; page?: string }>;
}

export default function Page({ searchParams }: SearchPageProps) {
    return <SearchScreen searchParams={searchParams} />;
}
