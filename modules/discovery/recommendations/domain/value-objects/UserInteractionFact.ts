export class UserInteractionFact {
    constructor(
        public readonly bookId: string,
        public readonly liked: boolean,
        public readonly rating: number | null,
        public readonly completionPercent: number,
        public readonly interactionCount: number,
        public readonly lastActivityAt: Date | null
    ) {}
}
