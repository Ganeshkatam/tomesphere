import { DomainEvent } from '@/modules/core/domain/DomainEvent';
import { ProfileOutput } from '../../queries/GetProfileDashboard/read-model';

export interface UpdateProfileOutput {
    readonly output: ProfileOutput;
    readonly events: DomainEvent[];
}
