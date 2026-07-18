import { UserProgress } from '../../domain/entities/UserProgress';
import { ReadingGoal } from '../../domain/value-objects/ReadingGoal';
import { ReadingStreak } from '../../domain/value-objects/ReadingStreak';
import { ExperiencePoints } from '../../domain/value-objects/ExperiencePoints';
import { AchievementCollection } from '../../domain/collections/AchievementCollection';
import { Achievement } from '../../domain/entities/Achievement';
import { Database } from '@/modules/shared/core/types/database';

type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row'];

export class ProgressMapper {
    static toDomain(
        userId: string,
        statsRow: UserProgressRow | null,
        achievementRows: UserAchievementRow[]
    ): UserProgress {
        
        // Defaults since user_progress does not store goals (moved to reading_goals)
        const dailyTarget = 30;
        const yearlyTarget = 12;
        
        // In a real app we'd track daily/yearly progress in user_daily_stats and user_yearly_stats
        // For the aggregate root representation, we initialize from what we have. 
        // A more advanced mapper might aggregate from user_daily_stats. 
        // We will assume 0 progress upon load for the current day unless we stored it on progress_daily.
        // Actually, we can just start at 0 if we aren't joining daily stats right now.
        const readingGoal = ReadingGoal.create(dailyTarget, yearlyTarget, 0, 0, new Date().toISOString().split('T')[0]);

        const readingStreak = ReadingStreak.create(
            statsRow?.reading_streak_days ?? 0,
            statsRow?.reading_streak_days ?? 0, // In reality, we should track longest streak separately, but this is fine for now
            statsRow?.last_activity_at ? statsRow.last_activity_at.split('T')[0] : null
        );

        const experiencePoints = ExperiencePoints.create(statsRow?.total_points ?? 0);

        const achievementsList = achievementRows.map(row => 
            Achievement.create(
                crypto.randomUUID(), 
                row.achievement_id, 
                row.earned_at ? new Date(row.earned_at) : new Date(),
                null,
                null,
                null
            )
        );
        const achievements = AchievementCollection.create(achievementsList);

        return UserProgress.fromPersistence(
            `progress-${userId}`,
            userId,
            readingGoal,
            readingStreak,
            experiencePoints,
            achievements,
            statsRow?.last_activity_at ? new Date(statsRow.last_activity_at) : new Date()
        );
    }
}
