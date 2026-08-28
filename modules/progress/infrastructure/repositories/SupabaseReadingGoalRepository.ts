import { ReadingGoalRepository } from "../../domain/repositories/ReadingGoalRepository";
import { ReadingGoal, ReadingGoalType } from "../../domain/entities/ReadingGoal";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export class SupabaseReadingGoalRepository implements ReadingGoalRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(id: string): Promise<ReadingGoal | null> {
    const { data, error } = await this.supabase
      .from("reading_goals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByUserIdAndType(
    userId: string,
    goalType: ReadingGoalType,
    year?: number,
  ): Promise<ReadingGoal | null> {
    let query = this.supabase
      .from("reading_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("goal_type", goalType);

    if (year !== undefined) {
      query = query.eq("year", year);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByUserIdAndYear(
    userId: string,
    year: number,
  ): Promise<ReadingGoal | null> {
    const { data, error } = await this.supabase
      .from("reading_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("goal_type", "books_per_year")
      .eq("year", year)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async listActiveByUserId(userId: string): Promise<ReadingGoal[]> {
    const { data, error } = await this.supabase
      .from("reading_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((row) => this.mapToDomain(row));
  }

  async save(goal: ReadingGoal): Promise<void> {
    const { error } = await this.supabase.from("reading_goals").upsert({
      id: goal.id,
      user_id: goal.userId,
      goal_type: goal.goalType,
      target_value: goal.targetValue,
      current_value: goal.currentValue,
      year: goal.year || null,
      is_active: goal.isActive,
      start_date: goal.startDate || null,
      end_date: goal.endDate || null,
      created_at: goal.createdAt.toISOString(),
      updated_at: goal.updatedAt.toISOString(),
    });

    if (error) {
      throw new Error(`Failed to save reading goal: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("reading_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete reading goal: ${error.message}`);
    }
  }

  private mapToDomain(data: any): ReadingGoal {
    return ReadingGoal.create(data.id, {
      userId: data.user_id,
      goalType: data.goal_type as ReadingGoalType,
      targetValue: Number(data.target_value),
      currentValue: Number(data.current_value || 0),
      year: data.year ? Number(data.year) : null,
      isActive: data.is_active !== false,
      startDate: data.start_date || null,
      endDate: data.end_date || null,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: data.updated_at
        ? new Date(data.updated_at)
        : new Date(data.created_at || Date.now()),
    });
  }
}
