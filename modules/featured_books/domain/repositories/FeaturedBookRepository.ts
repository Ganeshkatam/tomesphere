import { FeaturedBook } from "../entities/FeaturedBook";

export interface FeaturedBookRepository {
  list(): Promise<FeaturedBook[]>;
  saveAll(entities: FeaturedBook[]): Promise<void>;
}
