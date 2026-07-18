import { getExamPrepStats } from '@/modules/planner/academic/actions/academic';
import ExamPrepClient from '@/modules/planner/academic/components/ExamPrepClient';

export const dynamic = 'force-dynamic';

export default async function ExamPrepPage() {
    const res = await getExamPrepStats();
    const initialStats = res.success && res.data ? {
        totalTests: res.data.testsCompleted,
        averageScore: res.data.averageScore,
        totalFlashcards: res.data.flashcardsCreated
    } : { totalTests: 0, averageScore: 0, totalFlashcards: 0 };

    return <ExamPrepClient initialStats={initialStats} />;
}
