import { SupabaseClient } from "@supabase/supabase-js";
import { SupportReadModel } from "../../application/ports/read-models/SupportReadModel";
import { FaqDto } from "../../application/dto/FaqDto";

export class SupabaseSupportReadModel implements SupportReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getFaqs(): Promise<FaqDto[]> {
    const { data, error } = await this.supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch FAQs: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      displayOrder: row.display_order,
    }));
  }
}
