'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/learning/citations/types';

/**
 * Supermemo-2 Algorithm Implementation (SM-2)
 *
 * @param quality 0-5 (0 = complete blackout, 5 = perfect response)
 * @param easeFactor current ease factor (starts at 2.5)
 * @param intervalDays current interval in days
 * @param repetitions current repetitions
 */
function calculateSM2(
    quality: number,
    easeFactor: number,
    intervalDays: number,
    repetitions: number
) {
    let nextInterval: number;
    let nextRepetitions: number;
    let nextEaseFactor: number;

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            nextInterval = 1;
        } else if (repetitions === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(intervalDays * easeFactor);
        }
        nextRepetitions = repetitions + 1;
    } else {
        // Incorrect response
        nextRepetitions = 0;
        nextInterval = 1;
    }

    // Update ease factor (min 1.3)
    nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

    return {
        easeFactor: Number(nextEaseFactor.toFixed(2)),
        intervalDays: nextInterval,
        repetitions: nextRepetitions
    };
}

export async function addReviewItem(
    bookId: string | null,
    content: string,
    answer: string | null = null
): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase.from('review_items').insert({
        user_id: user.id,
        book_id: bookId,
        content,
        answer,
        due_date: new Date().toISOString().split('T')[0] // Due today initially
    });

    if (error) {
        console.error('Error adding review item:', error);
        return { success: false, error: 'Failed to add review item' };
    }

    return { success: true, data: undefined };
}

import { Tables } from '@/modules/shared/core/types/supabase';
export async function getDueReviewItems(): Promise<ActionResult<Tables<'review_items'>[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('review_items')
        .select('*')
        .eq('user_id', user.id)
        .lte('due_date', today)
        .order('due_date', { ascending: true })
        .limit(20);

    if (error) {
        console.error('Error fetching review items:', error);
        return { success: false, error: 'Failed to fetch review items' };
    }

    return { success: true, data: data || [] };
}

export async function processReviewItem(
    itemId: string,
    quality: number // 0-5
): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // 1. Fetch current stats
    const { data: item, error: fetchError } = await supabase
        .from('review_items')
        .select('*')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !item) {
        return { success: false, error: 'Review item not found' };
    }

    // 2. Calculate next state via SM-2
    const { easeFactor, intervalDays, repetitions } = calculateSM2(
        quality,
        item.ease_factor,
        item.interval_days,
        item.repetitions
    );

    // 3. Set next due date
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + intervalDays);
    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];

    // 4. Update
    const { error: updateError } = await supabase
        .from('review_items')
        .update({
            ease_factor: easeFactor,
            interval_days: intervalDays,
            repetitions: repetitions,
            due_date: nextDueDateStr,
            last_reviewed_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('user_id', user.id);

    if (updateError) {
        console.error('Error updating review item:', updateError);
        return { success: false, error: 'Failed to process review' };
    }

    return { success: true, data: undefined };
}

// ----------------------------------------------------------------------
// DIAGNOSTIC STUDY PLAN GENERATOR
// ----------------------------------------------------------------------

export interface StudyPlanItem {
    id: string;
    type: 'review' | 'learn' | 'practice';
    title: string;
    description: string;
    estimated_minutes: number;
    priority: 'high' | 'medium' | 'low';
}

export async function generateDailyStudyPlan(): Promise<ActionResult<StudyPlanItem[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const today = new Date().toISOString().split('T')[0];

    // 1. Check if plan already exists for today
    const { data: existingPlan, error: fetchError } = await supabase
        .from('user_study_plan')
        .select('*, books(title, cover_url)')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('priority', { ascending: true });

    if (fetchError) {
        console.error('Error fetching study plan:', fetchError);
        return { success: false, error: 'Failed to fetch study plan' };
    }

    if (existingPlan && existingPlan.length > 0) {
        return { success: true, data: existingPlan };
    }

    // 2. GENERATE NEW PLAN based on weak subjects & progress
    // Here we use progress_daily and library_books
    const [statsRes, readingRes, dueReviewsRes] = await Promise.all([
        supabase.from('progress_daily').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(7),
        supabase.from('library_books').select('book_id, books(title, genre), updated_at').eq('user_id', user.id).eq('status', 'currently_reading'),
        getDueReviewItems()
    ]);

    const tasks = [];
    let priority = 1;

    // A. Review Task (Spaced Repetition)
    const dueReviewsCount = (dueReviewsRes.success && dueReviewsRes.data) ? dueReviewsRes.data.length : 0;
    if (dueReviewsCount > 0) {
        tasks.push({
            user_id: user.id,
            date: today,
            task_type: 'revise',
            duration_minutes: Math.min(15, dueReviewsCount * 2), // 2 mins per review roughly
            priority: priority++,
            reason: `You have ${dueReviewsCount} items due for review to prevent forgetting.`
        });
    }

    // B. Continue Reading (Currently reading books)
    const activeBooks = readingRes.data || [];
    for (const item of activeBooks) {
        // Basic heuristic: allocate 20 mins to continue active books
        tasks.push({
            user_id: user.id,
            date: today,
            book_id: item.book_id,
            genre: (item.books as any)?.genre,
            task_type: 'continue',
            duration_minutes: 20,
            priority: priority++,
            reason: `Keep your momentum going on ${(item.books as any)?.title || 'this book'}.`
        });
    }

    // C. Weak Subject Detection
    // For MVP, we simulate a weak subject if the user had very low efficiency in the past week
    // Efficiency = progress (pages_read) / time (reading_time_minutes)
    let totalTime = 0;
    let totalPages = 0;

    if (statsRes.data) {
        for (const stat of statsRes.data) {
            totalTime += stat.reading_time_minutes || 0;
            totalPages += stat.pages_read || 0;
        }
    }

    if (totalTime > 0 && (totalPages / totalTime) < 0.5) { // less than 0.5 pages per minute
        tasks.push({
            user_id: user.id,
            date: today,
            task_type: 'improve',
            duration_minutes: 15,
            priority: priority++,
            reason: 'Your reading speed has been low recently. Dedicate 15 minutes to focused speed reading practice.'
        });
    }

    // Fallback: If no tasks generated, give a default "start reading" task
    if (tasks.length === 0) {
        tasks.push({
            user_id: user.id,
            date: today,
            task_type: 'start',
            duration_minutes: 30,
            priority: priority++,
            reason: 'Start a new book from your recommendations or reading list.'
        });
    }

    // 3. Save new plan
    const { error: insertError } = await supabase
        .from('user_study_plan')
        .insert(tasks);

    if (insertError) {
        console.error('Error generating study plan:', insertError);
        return { success: false, error: 'Failed to generate plan' };
    }

    // 4. Return new plan
    const { data: newPlan } = await supabase
        .from('user_study_plan')
        .select('*, books(title, cover_url)')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('priority', { ascending: true });

    return { success: true, data: newPlan || [] };
}
