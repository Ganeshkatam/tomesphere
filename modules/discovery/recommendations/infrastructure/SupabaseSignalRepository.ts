import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/modules/shared/core/types/database';
import { SignalRepository } from '../domain/repositories/SignalRepository';
import { UserInteractionFact } from '../domain/value-objects/UserInteractionFact';
import { BookFeature } from '../domain/value-objects/BookFeature';

export class SupabaseSignalRepository implements SignalRepository {
    constructor(private readonly supabase: SupabaseClient<Database>) {}

    async getUserInteractions(userId: string): Promise<UserInteractionFact[]> {
        const { data, error } = await this.supabase
            .from('discovery_recommendation_signals')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user interactions:', error);
            return [];
        }

        return (data || []).map(row => new UserInteractionFact(
            row.book_id,
            row.liked ?? false,
            row.rating,
            row.completion_percent ? Number(row.completion_percent) : 0,
            row.interaction_count ?? 0,
            row.last_activity_at ? new Date(row.last_activity_at) : null
        ));
    }

    async getBookFeatures(bookIds: string[]): Promise<BookFeature[]> {
        if (bookIds.length === 0) return [];

        const { data, error } = await this.supabase
            .from('discovery_book_features')
            .select('*')
            .in('book_id', bookIds);

        if (error) {
            console.error('Error fetching book features:', error);
            return [];
        }

        return (data || []).map(row => new BookFeature(
            row.book_id,
            row.popularity_score ? Number(row.popularity_score) : 0,
            row.embedding_score ? Number(row.embedding_score) : 0,
            row.trending_score ? Number(row.trending_score) : 0
        ));
    }
}
