import { FinishReadingSessionInput } from './input';

export class FinishReadingSessionCommand {
    constructor(public readonly input: FinishReadingSessionInput) {}
}
