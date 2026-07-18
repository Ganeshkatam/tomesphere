'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';
import { addReviewItem } from '@/modules/learning/foundation/actions/study-plan';

// ─── Notes ───────────────────────────────────────────────────

export async function createNote(bookId: string | null, title: string, content: string, tags: string[] = []): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        book_id: bookId,
        title,
        content,
        tags
    });

    if (error) return { success: false, error: 'Failed to create note' };
    return { success: true, data: undefined };
}

import { Tables } from '@/modules/shared/core/types/supabase';
export async function getNoteDetails(id: string): Promise<ActionResult<Tables<'notes'> & { books?: { title: string } }>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error || !data) return { success: false, error: 'Failed to fetch note' };
    return { success: true, data };
}

export async function updateNote(id: string, title: string, content: string, tags: string[] = []): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('notes').update({
        title,
        content,
        tags,
        updated_at: new Date().toISOString()
    }).eq('id', id).eq('user_id', user.id);

    if (error) return { success: false, error: 'Failed to update note' };
    return { success: true, data: undefined };
}

export async function deleteNote(id: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id);
    if (error) return { success: false, error: 'Failed to delete note' };
    return { success: true, data: undefined };
}

// ─── Flashcards ──────────────────────────────────────────────

export async function getFlashcards(): Promise<ActionResult<Tables<'flashcards'>[]>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return { success: false, error: 'Failed to load flashcards' };
    return { success: true, data: data || [] };
}

export async function createFlashcard(subject: string | null, front: string, back: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('flashcards').insert({
        user_id: user.id,
        subject: subject,
        front_text: front,
        back_text: back
    });

    if (error) return { success: false, error: 'Failed to create flashcard' };

    // Push into the Spaced Repetition Engine (SM-2 review layer)
    await addReviewItem(null, front, back);

    return { success: true, data: undefined };
}

export async function deleteFlashcard(id: string): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('flashcards').delete().eq('id', id).eq('user_id', user.id);
    if (error) return { success: false, error: 'Failed to delete flashcard' };
    return { success: true, data: undefined };
}

// ─── Practice Tests ──────────────────────────────────────────

export async function getPracticeTests(subject?: string): Promise<ActionResult<Tables<'practice_tests'>[]>> {
    const supabase = await createSupabaseServerClient();
    let query = supabase.from('practice_tests').select('*');
    
    if (subject && subject !== 'All') {
        query = query.eq('subject', subject);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
    
    if (error) return { success: false, error: 'Failed to fetch practice tests' };
    return { success: true, data: data || [] };
}

export interface TestDetailsPayload {
    test: Tables<'practice_tests'>;
    questions: Tables<'test_questions'>[];
}

export async function getTestDetails(testId: string): Promise<ActionResult<TestDetailsPayload>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const [testRes, questionsRes] = await Promise.all([
        supabase.from('practice_tests').select('*').eq('id', testId).single(),
        supabase.from('test_questions').select('*').eq('test_id', testId).order('created_at', { ascending: true })
    ]);

    if (testRes.error || !testRes.data) return { success: false, error: 'Test not found' };

    return { 
        success: true, 
        data: { 
            test: testRes.data, 
            questions: questionsRes.data || [] 
        } 
    };
}

export async function getExamPrepStats(): Promise<ActionResult<{ averageScore: number; testsCompleted: number; flashcardsCreated: number }>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const [attemptsRes, flashcardsRes] = await Promise.all([
        supabase.from('user_test_attempts').select('score').eq('user_id', user.id),
        supabase.from('flashcards').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    const attempts = attemptsRes.data || [];
    const avgScore = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
        : 0;

    return {
        success: true,
        data: {
            averageScore: avgScore,
            testsCompleted: attempts.length,
            flashcardsCreated: flashcardsRes.count || 0
        }
    };
}

export async function saveTestAttempt(testId: string, score: number, answers: Record<string, string | number>): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('user_test_attempts').insert({
        user_id: user.id,
        test_id: testId,
        score,
        answers
    });

    if (error) return { success: false, error: 'Failed to save test attempt' };
    return { success: true, data: undefined };
}
