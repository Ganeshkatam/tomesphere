export interface UserAffinity {
  readonly userId: string;
  readonly categoryAffinities: readonly string[];
}

export class RecommendationContextStore {
  private readonly affinities = new Map<string, string[]>();

  public recordAffinity(userId: string, category: string): void {
    const current = this.affinities.get(userId) || [];
    if (!current.includes(category)) {
      this.affinities.set(userId, [...current, category]);
    }
  }

  public getAffinities(userId: string): readonly string[] {
    return Object.freeze(this.affinities.get(userId) || []);
  }
}
