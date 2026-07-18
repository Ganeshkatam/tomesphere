import { getFlashcards } from '@/modules/planner/academic/actions/academic';
import FlashcardsClient from '@/modules/planner/academic/components/FlashcardsClient';

export const dynamic = 'force-dynamic';

export default async function FlashcardsPage() {
    const res = await getFlashcards();
    const initialFlashcards = res.success && res.data ? res.data : [];

    return <FlashcardsClient initialFlashcards={initialFlashcards} />;
}
