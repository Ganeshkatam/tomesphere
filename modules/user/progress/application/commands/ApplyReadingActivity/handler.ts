import { ProgressRepository } from '../../../domain/repositories/ProgressRepository';
import { UserId } from '@/modules/core/domain/UserId';
import { ReadingActivity } from '../../../domain/value-objects/ReadingActivity';

export interface ApplyReadingActivityRequest {
    userId: string;
    minutes: number;
    pages: number;
    completedBooks?: number;
    date?: Date;
}

export class ApplyReadingActivity {
    constructor(private readonly repository: ProgressRepository) { }

    async execute(request: ApplyReadingActivityRequest): Promise<void> {
        const userId = UserId.create(request.userId);

        let progress = await this.repository.findByUserId(userId);
        if (!progress) {
            // Ideally a user profile creation event should seed progress.
            // For now, if not found, we could throw or create a default instance.
            throw new Error('User progress not found');
        }

        const activity = ReadingActivity.create(
            request.minutes,
            request.pages,
            request.completedBooks || 0,
            request.date || new Date()
        );

        progress.applyReadingActivity(activity);

        await this.repository.save(progress);
    }
}
