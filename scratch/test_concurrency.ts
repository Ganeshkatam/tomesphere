import { createClient } from "@supabase/supabase-js";
import { SupabaseBookRepository } from "../modules/books/infrastructure/SupabaseBookRepository";
import { BookId } from "../modules/books/domain/value-objects";
import { Book } from "../modules/books/domain/entities/Book";
import { config } from "dotenv";
try { config({ path: ".env.local" }); } catch (e) {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const repo = new SupabaseBookRepository(supabase as any);
  const idStr = "550e8400-e29b-41d4-a716-446655440000";

  // Create a base book
  const book1 = Book.create({
    id: BookId.create(idStr),
    title: "Concurrency Test Book",
    authors: [],
    genres: [],
    subjects: [],
    description: "description",
    isTextbook: false,
    files: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await repo.save(book1);
  console.log("Book 1 saved, version:", book1.version);

  // Load two copies
  const b1 = await repo.findById(BookId.create(idStr));
  const b2 = await repo.findById(BookId.create(idStr));

  // Editor A updates and saves
  b1!.updateDetails({ title: "Editor A title" });
  await repo.save(b1!);
  console.log("Editor A saved successfully");

  // Editor B tries to update and save
  try {
    b2!.updateDetails({ title: "Editor B title" });
    await repo.save(b2!);
    console.log("Editor B saved unexpectedly!");
  } catch (err: any) {
    console.log("Editor B save failed as expected:", err.message);
  }

  const { data: outbox } = await supabase.from("outbox_messages").select("*").eq("aggregate_id", idStr);
  console.log("Outbox events for this book:", outbox?.length);
}

run().catch(console.error);
