'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';
import { SupabaseProfileRepository } from '../infrastructure/repositories/SupabaseProfileRepository';
import { getProfileDashboard } from '../application/queries/GetProfileDashboard/handler';
import { updateProfile as executeUpdateProfile } from '../application/commands/UpdateProfile/handler';
import { GetProfileDashboardOutput } from '../application/queries/GetProfileDashboard/read-model';
import { getFinishedBooksAction } from '@/modules/reading/library/actions/library';
import { Profile } from '@/modules/shared/core/types/supabase';
import { eventBus } from '@/modules/shared/core/events/EventBus';
import { logSystemEvent } from '@/lib/logger';
import { validateInput, UUIDSchema } from '@/lib/validators';

export async function getProfileData(): Promise<ActionResult<GetProfileDashboardOutput>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const repository = new SupabaseProfileRepository(supabase);

    try {
        const dashboard = await getProfileDashboard({
            profileRepository: repository,
            fetchFollowersCount: async (userId) => {
                const { count } = await supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId);
                return count || 0;
            },
            fetchFollowingCount: async (userId) => {
                const { count } = await supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId);
                return count || 0;
            },
            fetchFinishedBooks: async (userId) => {
                const res = await getFinishedBooksAction(); // this uses the current user session which matches userId
                return res.success && res.data ? res.data : [];
            }
        }, user.id);

        return { success: true, data: dashboard };
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to fetch profile dashboard' };
    }
}

export async function getPublicProfileData(targetUserId: string): Promise<ActionResult<GetProfileDashboardOutput & { isFollowing: boolean }>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const repository = new SupabaseProfileRepository(supabase);

    try {
        const dashboard = await getProfileDashboard({
            profileRepository: repository,
            fetchFollowersCount: async (uid) => {
                const { count } = await supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', uid);
                return count || 0;
            },
            fetchFollowingCount: async (uid) => {
                const { count } = await supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', uid);
                return count || 0;
            },
            fetchFinishedBooks: async (uid) => {
                // To fetch public finished books we would need a proper use case, but for now we fallback to the same query
                return []; 
            }
        }, targetUserId);

        let isFollowing = false;
        if (user) {
            const { data } = await supabase.from('user_follows').select('id').eq('follower_id', user.id).eq('following_id', targetUserId).single();
            isFollowing = !!data;
        }

        return { success: true, data: { ...dashboard, isFollowing } };
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to fetch public profile dashboard' };
    }
}

export async function updateProfile(updateData: { name?: string; avatar_url?: string; biography?: string; location?: string }): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const repository = new SupabaseProfileRepository(supabase);

    try {
        const result = await executeUpdateProfile(repository, {
            userId: user.id,
            displayName: updateData.name,
            avatarUrl: updateData.avatar_url,
            biography: updateData.biography,
            location: updateData.location
        });

        // Optionally, log an event
        await logSystemEvent('INFO', 'ProfileUpdate', 'User successfully updated profile fields', {});
        
        return { success: true, data: undefined };
    } catch (e: any) {
        await logSystemEvent('ERROR', 'ProfileUpdate', 'Failed to update profile', { error: e.message || String(e) });
        return { success: false, error: e.message || 'Failed to update profile' };
    }
}

// Below are other legacy methods that are retained for now but could be refactored into their respective domains (like Social / Progress).

export async function logReadingSession(seconds: number): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: stats } = await supabase
        .from('user_progress')
        .select('total_reading_time_seconds')
        .eq('user_id', user.id)
        .single();

    const currentSeconds = stats?.total_reading_time_seconds || 0;

    const { error } = await supabase
        .from('user_progress')
        .update({ total_reading_time_seconds: currentSeconds + seconds })
        .eq('user_id', user.id);

    if (error) {
        console.error('[logReadingSession]', error.message);
        return { success: false, error: 'Failed to log reading time' };
    }

    return { success: true, data: undefined };
}

export async function toggleFollow(targetUserId: string): Promise<ActionResult<{ isFollowing: boolean }>> {
    const idCheck = validateInput(UUIDSchema, targetUserId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    if (user.id === idCheck.data) {
        return { success: false, error: 'Cannot follow yourself' };
    }

    const { data: existingFollow } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    if (existingFollow) {
        const { error } = await supabase.from('user_follows').delete().eq('follower_id', user.id).eq('following_id', targetUserId);
        if (error) return { success: false, error: 'Failed to unfollow user' };
        return { success: true, data: { isFollowing: false } };
    } else {
        const { error } = await supabase.from('user_follows').insert({ follower_id: user.id, following_id: targetUserId });
        if (error) return { success: false, error: 'Failed to follow user' };
        await supabase.from('activity_log').insert({ user_id: user.id, action_type: 'follow', metadata: { target_user_id: targetUserId } });
        return { success: true, data: { isFollowing: true } };
    }
}

export interface NetworkDataPayload {
    followers: Profile[];
    following: Profile[];
    suggestedUsers: Profile[];
}

export async function getNetworkData(): Promise<ActionResult<NetworkDataPayload>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const [followersRes, followingRes] = await Promise.all([
        supabase.from('user_follows').select('follower_id, profiles!user_follows_follower_id_fkey(*)').eq('following_id', user.id),
        supabase.from('user_follows').select('following_id, profiles!user_follows_following_id_fkey(*)').eq('follower_id', user.id)
    ]);

    const myFollowers = (followersRes.data?.map((f) => f.profiles) || []) as unknown as Profile[];
    const myFollowing = (followingRes.data?.map((f) => f.profiles) || []) as unknown as Profile[];
    const followingIds = myFollowing.map((p) => p.id);

    let suggestionsQuery = supabase.from('profiles').select('*').neq('id', user.id).limit(5);
    if (followingIds.length > 0) {
        suggestionsQuery = suggestionsQuery.not('id', 'in', `(${followingIds.join(',')})`);
    }
    const suggestionsRes = await suggestionsQuery;

    return {
        success: true,
        data: {
            followers: myFollowers,
            following: myFollowing,
            suggestedUsers: suggestionsRes.data || []
        }
    };
}
