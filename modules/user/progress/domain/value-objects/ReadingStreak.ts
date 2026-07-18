import { ValueObject } from '@/modules/core/domain/ValueObject';

interface ReadingStreakProps {
    currentStreakDays: number;
    longestStreakDays: number;
    lastActiveDate: string | null; // ISO date string without time (YYYY-MM-DD)
}

export class ReadingStreak extends ValueObject<ReadingStreakProps> {
    get currentStreakDays(): number { return this.props.currentStreakDays; }
    get longestStreakDays(): number { return this.props.longestStreakDays; }
    get lastActiveDate(): string | null { return this.props.lastActiveDate; }

    private constructor(props: ReadingStreakProps) {
        super(props);
    }

    static create(currentStreakDays: number = 0, longestStreakDays: number = 0, lastActiveDate: string | null = null): ReadingStreak {
        return new ReadingStreak({ currentStreakDays, longestStreakDays, lastActiveDate });
    }

    /**
     * Evaluates the streak against a given date to see if it should be extended or reset.
     * Returns the new streak state and a boolean indicating if the streak was extended.
     */
    evaluate(activityDate: Date): { newStreak: ReadingStreak; extended: boolean; lost: boolean } {
        const activityDateStr = activityDate.toISOString().split('T')[0];

        // If no previous activity, start streak
        if (!this.props.lastActiveDate) {
            return {
                newStreak: new ReadingStreak({
                    currentStreakDays: 1,
                    longestStreakDays: Math.max(1, this.props.longestStreakDays),
                    lastActiveDate: activityDateStr
                }),
                extended: true,
                lost: false
            };
        }

        const lastActive = new Date(this.props.lastActiveDate);
        const current = new Date(activityDateStr);
        
        // Calculate difference in days (ignoring timezones by strictly using UTC start of day if parsed as UTC, 
        // but simple date strings are parsed reliably if we just use math on the strings)
        // A safer way:
        const diffTime = current.getTime() - lastActive.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays === 0) {
            // Already active today
            return { newStreak: this, extended: false, lost: false };
        } else if (diffDays === 1) {
            // Extended streak
            const newCurrent = this.props.currentStreakDays + 1;
            return {
                newStreak: new ReadingStreak({
                    currentStreakDays: newCurrent,
                    longestStreakDays: Math.max(newCurrent, this.props.longestStreakDays),
                    lastActiveDate: activityDateStr
                }),
                extended: true,
                lost: false
            };
        } else if (diffDays > 1) {
            // Missed a day, streak lost
            return {
                newStreak: new ReadingStreak({
                    currentStreakDays: 1,
                    longestStreakDays: this.props.longestStreakDays,
                    lastActiveDate: activityDateStr
                }),
                extended: false,
                lost: true
            };
        } else {
            // Activity in the past? Ignore it.
            return { newStreak: this, extended: false, lost: false };
        }
    }

    /**
     * Checks if the streak has already been lost based on today's date,
     * without actually registering new activity.
     */
    refresh(todayDate: Date = new Date()): { newStreak: ReadingStreak; lost: boolean } {
        if (!this.props.lastActiveDate) return { newStreak: this, lost: false };

        const todayStr = todayDate.toISOString().split('T')[0];
        const lastActive = new Date(this.props.lastActiveDate);
        const current = new Date(todayStr);
        
        const diffTime = current.getTime() - lastActive.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays > 1 && this.props.currentStreakDays > 0) {
            return {
                newStreak: new ReadingStreak({
                    currentStreakDays: 0,
                    longestStreakDays: this.props.longestStreakDays,
                    lastActiveDate: this.props.lastActiveDate
                }),
                lost: true
            };
        }

        return { newStreak: this, lost: false };
    }
}
