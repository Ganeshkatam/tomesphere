import { Achievement } from '../entities/Achievement';

export class AchievementCollection {
    private items: Achievement[];

    private constructor(items: Achievement[]) {
        this.items = [...items];
    }

    static create(items: Achievement[] = []): AchievementCollection {
        return new AchievementCollection(items);
    }

    get all(): Achievement[] {
        return [...this.items];
    }

    contains(achievementId: string): boolean {
        return this.items.some(a => a.achievementId === achievementId);
    }

    unlock(achievement: Achievement): { collection: AchievementCollection; newlyUnlocked: boolean } {
        if (this.contains(achievement.achievementId)) {
            return { collection: this, newlyUnlocked: false };
        }
        
        return {
            collection: new AchievementCollection([...this.items, achievement]),
            newlyUnlocked: true
        };
    }

    recentlyUnlocked(limit: number = 5): Achievement[] {
        return [...this.items]
            .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
            .slice(0, limit);
    }
}
