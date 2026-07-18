import { Entity } from '@/modules/core/domain/Entity';

export interface AchievementProps {
    achievementId: string;
    unlockedAt: Date;
    rarity: string | null;
    source: string | null;
    progress: number | null;
}

export class Achievement extends Entity<AchievementProps> {
    get achievementId(): string { return this.props.achievementId; }
    get unlockedAt(): Date { return this.props.unlockedAt; }
    get rarity(): string | null { return this.props.rarity; }
    get source(): string | null { return this.props.source; }
    get progress(): number | null { return this.props.progress; }

    private constructor(id: string, props: AchievementProps) {
        super(id, props);
    }

    static create(
        id: string,
        achievementId: string,
        unlockedAt: Date = new Date(),
        rarity: string | null = null,
        source: string | null = null,
        progress: number | null = null
    ): Achievement {
        return new Achievement(id, {
            achievementId,
            unlockedAt,
            rarity,
            source,
            progress
        });
    }
}
