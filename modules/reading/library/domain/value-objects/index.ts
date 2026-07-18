import { ValueObject } from '@/modules/core/domain/ValueObject';
import { ValidationError } from '@/modules/core/domain/DomainError';

export type ReadingStateValue = 'want_to_read' | 'currently_reading' | 'finished' | 'abandoned';

interface ReadingStateProps {
    value: ReadingStateValue;
}

export class ReadingState extends ValueObject<ReadingStateProps> {
    get value(): ReadingStateValue {
        return this.props.value;
    }

    private constructor(props: ReadingStateProps) {
        super(props);
    }

    static create(value: ReadingStateValue): ReadingState {
        return new ReadingState({ value });
    }

    static wantToRead(): ReadingState { return new ReadingState({ value: 'want_to_read' }); }
    static reading(): ReadingState { return new ReadingState({ value: 'currently_reading' }); }
    static finished(): ReadingState { return new ReadingState({ value: 'finished' }); }
    static abandoned(): ReadingState { return new ReadingState({ value: 'abandoned' }); }

    isFinished(): boolean { return this.value === 'finished'; }
    isActive(): boolean { return this.value === 'currently_reading'; }
    allowsProgress(): boolean { return this.value === 'currently_reading' || this.value === 'finished'; }

    canTransitionTo(newState: ReadingStateValue): boolean {
        if (this.value === newState) return true;

        switch (this.value) {
            case 'want_to_read':
                // Can start reading or abandon
                return newState === 'currently_reading' || newState === 'abandoned';
            case 'currently_reading':
                // Can finish, abandon, or go back to want_to_read (e.g., misclick)
                return ['finished', 'abandoned', 'want_to_read'].includes(newState);
            case 'finished':
                return ['currently_reading', 'want_to_read'].includes(newState);
            case 'abandoned':
                // Can restore
                return ['currently_reading', 'want_to_read'].includes(newState);
            default:
                return false;
        }
    }
}

interface ProgressPercentageProps {
    value: number;
}

export class ProgressPercentage extends ValueObject<ProgressPercentageProps> {
    get value(): number {
        return this.props.value;
    }

    private constructor(props: ProgressPercentageProps) {
        super(props);
    }

    static create(value: number): ProgressPercentage {
        if (value < 0 || value > 100) {
            throw new ValidationError(`Progress must be between 0 and 100. Got ${value}`);
        }
        return new ProgressPercentage({ value: Math.round(value) });
    }

    isComplete(): boolean {
        return this.value === 100;
    }
}

interface ReadingTimelineProps {
    startedAt: Date | null;
    finishedAt: Date | null;
    lastOpenedAt: Date | null;
}

export class ReadingTimeline extends ValueObject<ReadingTimelineProps> {
    get startedAt(): Date | null { return this.props.startedAt; }
    get finishedAt(): Date | null { return this.props.finishedAt; }
    get lastOpenedAt(): Date | null { return this.props.lastOpenedAt; }

    private constructor(props: ReadingTimelineProps) {
        super(props);
    }

    static empty(): ReadingTimeline {
        return new ReadingTimeline({ startedAt: null, finishedAt: null, lastOpenedAt: null });
    }

    static restore(startedAt: Date | null, finishedAt: Date | null, lastOpenedAt: Date | null): ReadingTimeline {
        return new ReadingTimeline({ startedAt, finishedAt, lastOpenedAt });
    }

    start(): ReadingTimeline {
        return new ReadingTimeline({ 
            startedAt: this.startedAt ?? new Date(), 
            finishedAt: this.finishedAt, 
            lastOpenedAt: new Date() 
        });
    }

    finish(): ReadingTimeline {
        return new ReadingTimeline({ 
            startedAt: this.startedAt, 
            finishedAt: new Date(), 
            lastOpenedAt: new Date() 
        });
    }

    touch(): ReadingTimeline {
        return new ReadingTimeline({ 
            startedAt: this.startedAt, 
            finishedAt: this.finishedAt, 
            lastOpenedAt: new Date() 
        });
    }

    resetFinish(): ReadingTimeline {
        return new ReadingTimeline({ 
            startedAt: this.startedAt, 
            finishedAt: null, 
            lastOpenedAt: new Date() 
        });
    }
}
