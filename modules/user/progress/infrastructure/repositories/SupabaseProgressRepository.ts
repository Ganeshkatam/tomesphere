import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/modules/shared/core/types/database';
import { ProgressRepository } from '../../domain/repositories/ProgressRepository';
import { UserProgress } from '../../domain/entities/UserProgress';
import { UserId } from '@/modules/core/domain/UserId';
import { ProgressMapper } from '../mappers/ProgressMapper';
import { eventBus } from '@/modules/shared/core/events/EventBus';

export class SupabaseProgressRepository implements ProgressRepository {
    constructor(private readonly supabase: SupabaseClient<Database>) {}

    async findByUserId(userId: UserId): Promise<UserProgress | null> {
        // Fetch stats
        const { data: statsData, error: statsError } = await this.supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId.value)
            .single();
            
        // We might not have a stats row for a brand new user, so statsError isn't necessarily a fatal error if it's PGRST116 (0 rows)
        if (statsError && statsError.code !== 'PGRST116') {
            console.error('Failed to fetch user_progress', statsError);
            return null;
        }

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await this.supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', userId.value);

        if (achievementsError) {
            console.error('Failed to fetch user_achievements', achievementsError);
            return null;
        }

        return ProgressMapper.toDomain(userId.value, statsData || null, achievementsData || []);
    }

    async save(progress: UserProgress): Promise<void> {
        const userId = progress.userId.value;

        // 1. Upsert Stats
        const { error: statsError } = await this.supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                reading_streak_days: progress.readingStreak.currentStreakDays,
                total_points: progress.experiencePoints.value,
                last_activity_at: progress.updatedAt.toISOString(),
            });

        if (statsError) {
            throw new Error(`Failed to save user_progress: ${statsError.message}`);
        }

        // 2. Fetch existing achievements to compute delta
        const { data: existingAchievements } = await this.supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId);
            
        const existingSet = new Set((existingAchievements || []).map(a => a.achievement_id));
        
        // Find newly unlocked achievements that aren't in the DB yet
        const newAchievements = progress.achievements.all.filter(a => !existingSet.has(a.achievementId));

        if (newAchievements.length > 0) {
            const { error: achievementsError } = await this.supabase
                .from('user_achievements')
                .insert(
                    newAchievements.map(a => ({
                        user_id: userId,
                        achievement_id: a.achievementId,
                        earned_at: a.unlockedAt.toISOString()
                    }))
                );

            if (achievementsError) {
                throw new Error(`Failed to save achievements: ${achievementsError.message}`);
            }
        }

        // 3. Publish Domain Events
        const events = progress.pullDomainEvents();
        for (const event of events) {
            if (event.eventName === 'LevelUp') {
                const e = event as any;
                eventBus.emit('progress:level_up', {
                    userId: e.aggregateId,
                    level: e.newLevel,
                    title: e.newTitle
                });
            } else if (event.eventName === 'AchievementUnlocked') {
                const e = event as any;
                eventBus.emit('progress:achievement_unlocked', {
                    userId: e.aggregateId,
                    achievementId: e.achievementId
                });
            }
        }
    }
}
