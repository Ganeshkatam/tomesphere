import { ValueObject } from './ValueObject';
import { ValidationError } from './DomainError';

interface UserIdProps {
    value: string;
}

export class UserId extends ValueObject<UserIdProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserIdProps) {
        super(props);
    }

    public static create(id: string): UserId {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('UserId cannot be empty');
        }
        return new UserId({ value: id });
    }
}
