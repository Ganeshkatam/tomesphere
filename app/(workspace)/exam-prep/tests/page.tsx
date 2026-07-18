import { getPracticeTests } from '@/modules/planner/academic/actions/academic';
import PracticeTestsClient from '@/modules/planner/academic/components/PracticeTestsClient';

export const dynamic = 'force-dynamic';

export default async function PracticeTestsPage() {
    // Fetch all tests so client can filter by subject instantly
    const res = await getPracticeTests('All');
    const initialTests = res.success && res.data ? res.data : [];

    return <PracticeTestsClient initialTests={initialTests} />;
}
