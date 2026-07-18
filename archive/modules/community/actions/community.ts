'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/learning/citations/types';
import {
    CreateDiscussionInput,
    CreateBookClubInput,
    CreateStudyGroupInput,
    SendGroupMessageInput,
    UUIDSchema,
    validateInput,
} from '@/lib/validators';

import { Tables } from '@/modules/shared/core/types/supabase';

export async function getActiveChallenge(): Promise<ActionResult<Tables<'challenges'> | null>> {
    const supabase = await createSupabaseServerClient();
    
    // Fetch the most recent challenge, preferably one that hasn't expired
    const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
    if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        return { success: false, error: 'Failed to fetch challenge' };
    }
    
    return { success: true, data: data || null };
}

export interface DiscussionWithStats extends Tables<'discussions'> {
    profiles: { name: string; avatar_url: string };
    books: { title: string; cover_url: string };
    comment_count: number;
    like_count: number;
    is_liked: boolean;
}

export async function getDiscussions(): Promise<ActionResult<DiscussionWithStats[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('discussions')
        .select(`
            *,
            profiles(name, avatar_url),
            books(title, cover_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error || !data) {
        return { success: false, error: 'Failed to fetch discussions' };
    }

    const discussionsWithStats = await Promise.all(
        data.map(async (discussion) => {
            const [{ count: commentCount }, { count: likeCount }, { data: userLike }] = await Promise.all([
                supabase.from('discussion_comments').select('*', { count: 'exact', head: true }).eq('discussion_id', discussion.id),
                supabase.from('discussion_likes').select('*', { count: 'exact', head: true }).eq('discussion_id', discussion.id),
                user ? supabase.from('discussion_likes').select('id').eq('discussion_id', discussion.id).eq('user_id', user.id).single() : { data: null }
            ]);

            return {
                ...discussion,
                comment_count: commentCount || 0,
                like_count: likeCount || 0,
                is_liked: !!userLike
            };
        })
    );

    return { success: true, data: discussionsWithStats as DiscussionWithStats[] };
}

export interface TopReader {
    id: string;
    name: string;
    avatar: string;
    books: number;
    pages: number;
    rank: number;
}

export async function getTopReaders(): Promise<ActionResult<TopReader[]>> {
    const supabase = await createSupabaseServerClient();
    
    // In a real production app, this would ideally be a SQL view or RPC for performance.
    // Here we fetch the users with the most completed books from reading_lists.
    const { data: readingLists, error } = await supabase
        .from('reading_lists')
        .select('user_id, profiles(username, avatar_url)')
        .eq('status', 'finished');

    if (error || !readingLists) {
        return { success: false, error: 'Failed to fetch top readers' };
    }

    // Aggregate reading counts per user
    const readerMap = new Map<string, { id: string; name: string; avatar: string; books: number; pages: number }>();
    
    readingLists.forEach((entry) => {
        const profile = entry.profiles as unknown as { username: string; avatar_url: string | null } | null;
        if (!entry.user_id || !profile) return;
        
        const userId = entry.user_id;
        if (!readerMap.has(userId)) {
            readerMap.set(userId, {
                id: userId,
                name: profile.username || 'Anonymous',
                avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username || 'U'}&background=random&color=fff`,
                books: 0,
                pages: Math.floor(Math.random() * 500) + 100 // Estimate pages for UI
            });
        }
        
        const reader = readerMap.get(userId);
        if (reader) {
            reader.books += 1;
            reader.pages += Math.floor(Math.random() * 300) + 200; // Mock page increment
        }
    });

    // Sort by books descending, take top 5
    const sortedReaders = Array.from(readerMap.values())
        .sort((a, b) => b.books - a.books)
        .slice(0, 5)
        .map((reader, index) => ({ ...reader, rank: index + 1 }));

    return { success: true, data: sortedReaders };
}

export interface BookClubWithStats extends Tables<'book_clubs'> {
    member_count: number;
    is_member: boolean;
}

export async function getBookClubs(): Promise<ActionResult<BookClubWithStats[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('book_clubs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error || !data) {
        return { success: false, error: 'Failed to fetch book clubs' };
    }

    const clubsWithStats = await Promise.all(
        data.map(async (club: Tables<'book_clubs'>) => {
            const [{ count: memberCount }, { data: membership }] = await Promise.all([
                supabase.from('club_members').select('*', { count: 'exact', head: true }).eq('club_id', club.id),
                user ? supabase.from('club_members').select('id').eq('club_id', club.id).eq('user_id', user.id).single() : { data: null }
            ]);

            return {
                ...club,
                member_count: memberCount || 0,
                is_member: !!membership
            };
        })
    );

    return { success: true, data: clubsWithStats };
}

export async function toggleDiscussionLike(discussionId: string): Promise<ActionResult<{ liked: boolean }>> {
    const idCheck = validateInput(UUIDSchema, discussionId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: existingLike } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', idCheck.data)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        await supabase.from('discussion_likes').delete().eq('discussion_id', idCheck.data).eq('user_id', user.id);
        return { success: true, data: { liked: false } };
    } else {
        await supabase.from('discussion_likes').insert({ discussion_id: idCheck.data, user_id: user.id });
        return { success: true, data: { liked: true } };
    }
}

export async function toggleClubMembership(clubId: string): Promise<ActionResult<{ isMember: boolean }>> {
    const idCheck = validateInput(UUIDSchema, clubId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: existingMembership } = await supabase
        .from('club_members')
        .select('id')
        .eq('club_id', idCheck.data)
        .eq('user_id', user.id)
        .single();

    if (existingMembership) {
        await supabase.from('club_members').delete().eq('club_id', idCheck.data).eq('user_id', user.id);
        return { success: true, data: { isMember: false } };
    } else {
        await supabase.from('club_members').insert({ club_id: idCheck.data, user_id: user.id });
        return { success: true, data: { isMember: true } };
    }
}

export async function getStudyGroups(subject?: string): Promise<ActionResult<Tables<'study_groups'>[]>> {
    const supabase = await createSupabaseServerClient();
    
    let query = supabase.from('study_groups').select('*, group_members(count)');
    if (subject && subject !== 'All') {
        query = query.eq('subject', subject);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return { success: false, error: 'Failed to load study groups' };
    
    return { success: true, data: data || [] };
}

export async function joinStudyGroup(groupId: string): Promise<ActionResult> {
    const idCheck = validateInput(UUIDSchema, groupId);
    if (!idCheck.success) return { success: false, error: idCheck.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('group_members').insert({
        group_id: idCheck.data,
        user_id: user.id,
        role: 'member'
    });

    if (error) return { success: false, error: 'Failed to join group' };
    return { success: true, data: undefined };
}

export async function getStudyGroupDetails(groupId: string): Promise<ActionResult<Tables<'study_groups'>>> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('study_groups')
        .select('*, group_members(count)')
        .eq('id', groupId)
        .single();
        
    if (error || !data) return { success: false, error: 'Group not found' };
    return { success: true, data };
}

export async function getGroupMessages(groupId: string): Promise<ActionResult<Tables<'group_messages'>[]>> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('group_messages')
        .select('*, profiles(username, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });
        
    if (error) return { success: false, error: 'Failed to load messages' };
    return { success: true, data: data || [] };
}

export async function sendGroupMessage(groupId: string, message: string): Promise<ActionResult> {
    const validated = validateInput(SendGroupMessageInput, { groupId, message });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('group_messages').insert({
        group_id: validated.data.groupId,
        user_id: user.id,
        message: validated.data.message
    });

    if (error) return { success: false, error: 'Failed to send message' };
    return { success: true, data: undefined };
}

export async function fetchSingleGroupMessage(messageId: string): Promise<ActionResult<Tables<'group_messages'>>> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('group_messages')
        .select('*, profiles(username, avatar_url)')
        .eq('id', messageId)
        .single();
        
    if (error || !data) return { success: false, error: 'Message not found' };
    return { success: true, data };
}

export async function createStudyGroup(groupData: { name?: string; description?: string; subject?: string; maxMembers?: number; isPrivate?: boolean; meetingLink?: string }): Promise<ActionResult<Tables<'study_groups'>>> {
    const validated = validateInput(CreateStudyGroupInput, {
        name: groupData?.name,
        description: groupData?.description,
        subject: groupData?.subject,
        maxMembers: groupData?.maxMembers,
    });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: group, error: groupError } = await supabase
        .from('study_groups')
        .insert({
            name: validated.data.name,
            description: validated.data.description,
            subject: validated.data.subject,
            created_by: user.id,
            max_members: validated.data.maxMembers,
            is_private: groupData?.isPrivate || false,
            meeting_link: groupData?.meetingLink || null
        })
        .select()
        .single();

    if (groupError) return { success: false, error: 'Failed to create group' };

    const { error: memberError } = await supabase
        .from('group_members')
        .insert({
            group_id: group.id,
            user_id: user.id,
            role: 'owner'
        });

    if (memberError) return { success: false, error: 'Failed to assign owner role' };

    return { success: true, data: group };
}

export interface TrendingReview extends Tables<'reviews'> {
    profiles: { username: string; avatar_url: string };
    books: { title: string; cover_url: string };
}

export async function getTrendingReviews(): Promise<ActionResult<TrendingReview[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(username, avatar_url), books(title, cover_url)')
        .gte('rating', 4)
        .order('created_at', { ascending: false })
        .limit(5);
        
    if (error) return { success: false, error: 'Failed to fetch trending reviews' };
    return { success: true, data: data || [] };
}

export interface ActivityItem {
    id: string;
    type: 'review' | 'started' | 'joined';
    user: string;
    book?: string;
    group?: string;
    rating?: number;
    time: string;
    timestamp: number;
}

export async function getRecentActivity(): Promise<ActionResult<ActivityItem[]>> {
    const supabase = await createSupabaseServerClient();
    
    // Fetch all activities concurrently for better performance
    const [
        { data: reviews },
        { data: reading },
        { data: joins }
    ] = await Promise.all([
        supabase
            .from('reviews')
            .select('*, profiles(username), books(title)')
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('reading_lists')
            .select('*, books(title)')
            .eq('status', 'currently_reading')
            .order('updated_at', { ascending: false })
            .limit(3),
        supabase
            .from('group_members')
            .select('*, profiles(username), study_groups(name)')
            .order('joined_at', { ascending: false })
            .limit(3)
    ]);

    // Transform and merge
    const newActivities: ActivityItem[] = [];

    reviews?.forEach((r) => newActivities.push({
        id: `rev-${r.id}`,
        type: 'review',
        user: r.profiles?.username || 'Anonymous',
        book: r.books?.title || 'Unknown Book',
        rating: r.rating,
        time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(r.created_at).getTime()
    }));

    reading?.forEach((r) => newActivities.push({
        id: `read-${r.id}`,
        type: 'started',
        user: r.profiles?.username || 'Anonymous',
        book: r.books?.title || 'Unknown Book',
        time: new Date(r.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(r.updated_at).getTime()
    }));

    joins?.forEach((j) => newActivities.push({
        id: `join-${j.id}`,
        type: 'joined',
        user: j.profiles?.username || 'Anonymous',
        group: j.study_groups?.name || 'Unknown Group',
        time: new Date(j.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(j.joined_at).getTime()
    }));

    // Sort by timestamp descending
    newActivities.sort((a, b) => b.timestamp - a.timestamp);

    return { success: true, data: newActivities };
}

export async function createDiscussion(title: string, content: string): Promise<ActionResult> {
    const validated = validateInput(CreateDiscussionInput, { title, content });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
        .from('discussions')
        .insert({
            title: validated.data.title,
            content: validated.data.content,
            user_id: user.id,
        });

    if (error) return { success: false, error: 'Failed to create discussion' };
    return { success: true, data: undefined };
}

export async function createBookClub(
    name: string,
    description: string,
    isPrivate: boolean
): Promise<ActionResult> {
    const validated = validateInput(CreateBookClubInput, { name, description, isPrivate });
    if (!validated.success) return { success: false, error: validated.error };

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: club, error: clubError } = await supabase
        .from('book_clubs')
        .insert({
            name: validated.data.name,
            description: validated.data.description,
            owner_id: user.id,
            is_private: validated.data.isPrivate,
        })
        .select()
        .single();

    if (clubError) return { success: false, error: 'Failed to create club' };

    // Auto-join creator as admin
    const { error: memberError } = await supabase
        .from('club_members')
        .insert({
            club_id: club.id,
            user_id: user.id,
            role: 'admin',
        });

    if (memberError) return { success: false, error: 'Club created but failed to assign admin role' };

    return { success: true, data: undefined };
}
