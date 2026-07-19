import { ReadingGoalRepository } from "../../domain/repositories/ReadingGoalRepository";
import { ReadingGoal } from "../../domain/entities/ReadingGoal";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseReadingGoalRepository implements ReadingGoalRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<ReadingGoal | null> {
    const { data, error } = await this.supabase
      .from("reading_goals")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByUserIdAndYear(userId: string, year: number): Promise<ReadingGoal | null> {
    const { data, error } = await this.supabase
      .from("reading_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("year", year)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async save(goal: ReadingGoal): Promise<void> {
    const { error } = await this.supabase.from("reading_goals").upsert({
      id: goal.id,
      user_id: goal.userId,
      year: goal.year,
      target_books: goal.targetBooks,
      books_read: goal.booksRead,
      created_at: goal.createdAt.toISOString(),
      updated_at: goal.updatedAt.toISOString(),
    });

    if (error) {
      throw new Error(`Failed to save reading goal: ${error.message}`);
    }
  }

  private mapToDomain(data: any): ReadingGoal {
    return ReadingGoal.create(data.id, {
      userId: data.user_id,
      year: data.year,
      targetBooks: data.target_books,
      booksRead: data.books_read,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(data.created_at),
    });
  }
}
