import { StartReadingSessionInput } from './input';

export class StartReadingSessionCommand {
    constructor(public readonly input: StartReadingSessionInput) {}
}
