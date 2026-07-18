import { UserId } from '@/modules/core/domain/UserId';
import { UserProgress } from '../entities/UserProgress';

export interface ProgressRepository {
    findByUserId(userId: UserId): Promise<UserProgress | null>;
    save(progress: UserProgress): Promise<void>;
}
