export class BookFeature {
    constructor(
        public readonly bookId: string,
        public readonly popularityScore: number,
        public readonly embeddingScore: number,
        public readonly trendingScore: number
    ) {}
}
