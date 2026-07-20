const fs = require('fs');

const basePath = 'd:/websites/tomesphere-app/modules/featured_books';
const adminPath = 'd:/websites/tomesphere-app/admin/src/features/featured_books';
const adminAppPath = 'd:/websites/tomesphere-app/admin/src/app/featured_books';

fs.mkdirSync(`${basePath}/domain/entities`, { recursive: true });
fs.mkdirSync(`${basePath}/domain/repositories`, { recursive: true });
fs.mkdirSync(`${basePath}/infrastructure`, { recursive: true });
fs.mkdirSync(`${basePath}/application/commands`, { recursive: true });
fs.mkdirSync(adminPath, { recursive: true });
fs.mkdirSync(adminAppPath, { recursive: true });

fs.writeFileSync(`${basePath}/domain/entities/FeaturedBook.ts`, `export interface FeaturedBook {
  book_id: string;
  position: number;
  starts_at?: string | null;
  ends_at?: string | null;
}
`);

fs.writeFileSync(`${basePath}/domain/repositories/FeaturedBookRepository.ts`, `import { FeaturedBook } from "../entities/FeaturedBook";

export interface FeaturedBookRepository {
  list(): Promise<FeaturedBook[]>;
  saveAll(entities: FeaturedBook[]): Promise<void>;
}
`);

fs.writeFileSync(`${basePath}/infrastructure/SupabaseFeaturedBookRepository.ts`, `import { SupabaseClient } from "@supabase/supabase-js";
import { FeaturedBook } from "../domain/entities/FeaturedBook";
import { FeaturedBookRepository } from "../domain/repositories/FeaturedBookRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseFeaturedBookRepository implements FeaturedBookRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async list(): Promise<FeaturedBook[]> {
    const { data, error } = await this.client
      .from("featured_books")
      .select("*")
      .order("position");

    if (error || !data) return [];
    
    return data.map(d => ({
      book_id: d.book_id,
      position: d.position,
      starts_at: d.starts_at,
      ends_at: d.ends_at,
    }));
  }

  async saveAll(entities: FeaturedBook[]): Promise<void> {
    // Delete all
    await this.client.from("featured_books").delete().neq("book_id", "00000000-0000-0000-0000-000000000000"); // hack to delete all

    // Insert new
    if (entities.length > 0) {
      const { error } = await this.client.from("featured_books").insert(
        entities.map(e => ({
          book_id: e.book_id,
          position: e.position,
          starts_at: e.starts_at,
          ends_at: e.ends_at,
        }))
      );
      if (error) throw new Error(\`Failed to save featured books: \${error.message}\`);
    }
  }
}
`);

fs.writeFileSync(`${basePath}/application/commands/UpdateFeaturedBooksCommand.ts`, `import { FeaturedBookRepository } from "../../domain/repositories/FeaturedBookRepository";
import { FeaturedBook } from "../../domain/entities/FeaturedBook";

export interface UpdateFeaturedBooksCommand {
  books: FeaturedBook[];
}

export class UpdateFeaturedBooksHandler {
  constructor(private readonly repository: FeaturedBookRepository) {}

  async execute(command: UpdateFeaturedBooksCommand): Promise<void> {
    await this.repository.saveAll(command.books);
  }
}
`);

fs.writeFileSync(`${basePath}/application/commands/index.ts`, `export * from "./UpdateFeaturedBooksCommand";
`);

fs.writeFileSync(`d:/websites/tomesphere-app/admin/src/lib/domain/featured_books.ts`, `export { UpdateFeaturedBooksHandler } from "../../../../modules/featured_books/application/commands";
export type { UpdateFeaturedBooksCommand } from "../../../../modules/featured_books/application/commands";
export { SupabaseFeaturedBookRepository } from "../../../../modules/featured_books/infrastructure/SupabaseFeaturedBookRepository";
export type { FeaturedBookRepository } from "../../../../modules/featured_books/domain/repositories/FeaturedBookRepository";
export type { FeaturedBook } from "../../../../modules/featured_books/domain/entities/FeaturedBook";
`);

fs.writeFileSync(`${adminPath}/actions.ts`, `"use server";

import { revalidatePath } from "next/cache";
import { 
  UpdateFeaturedBooksHandler,
  SupabaseFeaturedBookRepository,
  FeaturedBook
} from "../../lib/domain/featured_books";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../shared/core/types/database";

async function getRepository() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  return new SupabaseFeaturedBookRepository(supabase);
}

export async function updateFeaturedBooksAction(books: FeaturedBook[]) {
  const repository = await getRepository();
  const handler = new UpdateFeaturedBooksHandler(repository);

  await handler.execute({ books });

  revalidatePath("/featured_books");
  return;
}
`);

fs.writeFileSync(`${adminAppPath}/page.tsx`, `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../../../../../shared/core/types/database";

export default async function FeaturedBooksPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: items } = await supabase.from("featured_books").select("*, books(title)").order("position");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Featured Books</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Position</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Book</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Starts At</th>
              <th className="px-6 py-3 text-slate-500 font-medium text-sm uppercase">Ends At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items?.map((item: any) => (
              <tr key={item.book_id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{item.position}</td>
                <td className="px-6 py-4 font-medium">{item.books?.title}</td>
                <td className="px-6 py-4 text-slate-500">{item.starts_at || 'Immediately'}</td>
                <td className="px-6 py-4 text-slate-500">{item.ends_at || 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-500">Note: API for reordering via Drag-and-Drop would be hooked into the server action.</p>
    </div>
  );
}
`);
