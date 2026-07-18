'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/learning/citations/types';
import { Tables } from '@/modules/shared/core/types/supabase';

type Contest = Tables<'contests'>;

export async function getAllContests(): Promise<ActionResult<Contest[]>> {
    try {
        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .from('contests')
            .select('*')
            .order('end_date', { ascending: true });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error: unknown) {
        console.error('Error fetching contests:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch contests' };
    }
}

// ── Single Contest Detail + participation check ──
export async function getContestDetail(id: string): Promise<ActionResult<{ contest: Contest; isJoined: boolean }>> {
    try {
        const supabase = await createSupabaseServerClient();

        const { data: contest, error } = await supabase
            .from('contests')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return { success: false, error: error.message };

        let isJoined = false;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: participant } = await supabase
                .from('contest_participants')
                .select('id')
                .eq('contest_id', id)
                .eq('user_id', user.id)
                .single();
            isJoined = !!participant;
        }

        return { success: true, data: { contest, isJoined } };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch contest' };
    }
}

// ── Join Contest ──
export async function joinContest(contestId: string): Promise<ActionResult<null>> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('contest_participants')
            .insert({ contest_id: contestId, user_id: user.id });

        if (error) return { success: false, error: error.message };
        return { success: true, data: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to join contest' };
    }
}
