'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';

export interface AnalyticsStats {
    notesCount: number;
    testsCompleted: number;
    averageScore: number;
    studyStreak: number;
    flashcardsCount: number;
    lastStudyDate: string;
}

export async function getAnalyticsStats(): Promise<ActionResult<AnalyticsStats>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Fetch all stats concurrently
        const [notesRes, flashcardsRes, attemptsRes] = await Promise.all([
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('flashcards').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('user_test_attempts').select('score, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        const testsCompleted = attemptsRes.data?.length || 0;
        const averageScore = attemptsRes.data?.length
            ? attemptsRes.data.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / attemptsRes.data.length
            : 0;
        const lastStudyDate = attemptsRes.data?.[0]?.created_at || '';

        return {
            success: true,
            data: {
                notesCount: notesRes.count || 0,
                testsCompleted,
                averageScore,
                studyStreak: 0,
                flashcardsCount: flashcardsRes.count || 0,
                lastStudyDate
            }
        };
    } catch (error: unknown) {
        console.error('Error fetching analytics:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch analytics' };
    }
}
