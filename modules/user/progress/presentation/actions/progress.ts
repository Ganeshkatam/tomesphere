'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { SupabaseProgressRepository } from '../../infrastructure/repositories/SupabaseProgressRepository';
import { ApplyReadingActivity, ApplyReadingActivityRequest } from '../../application/commands/ApplyReadingActivity/handler';
import { GetProgressDashboard, GetProgressDashboardOutput } from '../../application/queries/GetProgressDashboard/handler';
import { z } from 'zod';

const ApplyReadingActivitySchema = z.object({
    minutes: z.number().min(1),
    pages: z.number().min(0),
    completedBooks: z.number().min(0).optional(),
    date: z.string().optional() // ISO date string
});

export async function applyReadingActivity(input: z.infer<typeof ApplyReadingActivitySchema>) {
    try {
        const validated = ApplyReadingActivitySchema.parse(input);
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Unauthorized');
        }

        const repository = new SupabaseProgressRepository(supabase);
        const useCase = new ApplyReadingActivity(repository);

        const request: ApplyReadingActivityRequest = {
            userId: user.id,
            minutes: validated.minutes,
            pages: validated.pages,
            completedBooks: validated.completedBooks,
            date: validated.date ? new Date(validated.date) : new Date()
        };

        await useCase.execute(request);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getProgressDashboard(): Promise<GetProgressDashboardOutput | null> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const repository = new SupabaseProgressRepository(supabase);
        const useCase = new GetProgressDashboard(repository);

        return await useCase.execute(user.id);
    } catch (error: any) {
        console.error('Failed to get progress dashboard:', error);
        return null;
    }
}
